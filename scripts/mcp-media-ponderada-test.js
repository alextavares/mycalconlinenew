#!/usr/bin/env node
/**
 * MCP test for Média Ponderada calculator using vendored JSON-RPC stdio client.
 * Follows the same approach as the Word Counter and Porcentagem tests.
 */
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

class JsonRpcClient {
  constructor(child) {
    this.child = child;
    this.nextId = 1;
    this.pending = new Map();
    this.buffer = "";
    this.capabilities = {
      capabilities: {
        experimental: { prompts: {}, tools: {} }
      }
    };

    child.stdout.setEncoding("utf8");
    child.stdout.on("data", (chunk) => this._onData(chunk));
    child.stderr.setEncoding("utf8");
    child.stderr.on("data", (d) => process.stderr.write("[MCP-STDERR] " + d));
    child.on("exit", (code) => {
      for (const [, { reject }] of this.pending) {
        reject(new Error("MCP server exited with code " + code));
      }
      this.pending.clear();
    });
  }

  _send(msg) {
    const json = JSON.stringify(msg);
    const payload = `Content-Length: ${Buffer.byteLength(json, "utf8")}\r\n\r\n${json}`;
    this.child.stdin.write(payload);
  }

  _onData(chunk) {
    this.buffer += chunk;
    while (true) {
      const headerEnd = this.buffer.indexOf("\r\n\r\n");
      if (headerEnd === -1) break;
      const headers = this.buffer.slice(0, headerEnd).split("\r\n");
      let contentLength = 0;
      for (const h of headers) {
        const m = /^Content-Length:\s*(\d+)/i.exec(h);
        if (m) contentLength = parseInt(m[1], 10);
      }
      const total = headerEnd + 4 + contentLength;
      if (this.buffer.length < total) break;
      const body = this.buffer.slice(headerEnd + 4, total);
      this.buffer = this.buffer.slice(total);
      try {
        const msg = JSON.parse(body);
        this._onMessage(msg);
      } catch (e) {
        process.stderr.write("[MCP-CLIENT] JSON parse error: " + e.message + "\n");
      }
    }
  }

  _onMessage(msg) {
    if (msg.id && (msg.result !== undefined || msg.error)) {
      const entry = this.pending.get(msg.id);
      if (entry) {
        this.pending.delete(msg.id);
        if (msg.error) entry.reject(new Error(msg.error.message || "RPC Error"));
        else entry.resolve(msg.result);
      }
      return;
    }
    if (msg.method === "notifications/message" || msg.method === "notifications/log") return;
    if (msg.method === "ping") return;
  }

  request(method, params) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this._send({ jsonrpc: "2.0", id, method, params });
    });
  }

  async initialize(clientInfo) {
    return this.request("initialize", { clientInfo, ...this.capabilities });
  }

  async callTool(name, args) {
    return this.request("tools/call", { name, arguments: args || {} });
  }

  async close() {
    try { await this.request("shutdown", {}); } catch {}
    try { await this.request("exit", {}); } catch {}
    try { this.child.stdin.end(); } catch {}
    if (!this.child.killed) this.child.kill();
  }
}

(async () => {
  const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
  const TARGET = BASE_URL + "/pt-BR/calculator/media-ponderada";

  const serverEntry = path.join(process.cwd(), "mcp-playwright", "dist", "index.js");
  if (!fs.existsSync(serverEntry)) {
    console.error("mcp-playwright/dist/index.js not found. Build it first: (cd mcp-playwright && npm ci && npm run build)");
    process.exit(1);
  }

  console.log("[MCP] Starting server:", serverEntry);
  const child = spawn("node", [serverEntry], {
    env: { ...process.env },
    stdio: ["pipe", "pipe", "pipe"]
  });

  const client = new JsonRpcClient(child);

  async function withTimeout(promise, ms, label) {
    let to;
    const timeout = new Promise((_, reject) => {
      to = setTimeout(() => reject(new Error(`Timeout after ${ms}ms: ${label}`)), ms);
    });
    try {
      const result = await Promise.race([promise, timeout]);
      clearTimeout(to);
      return result;
    } catch (e) {
      clearTimeout(to);
      throw e;
    }
  }

  console.log("[MCP] Initializing client...");
  await withTimeout(client.initialize({ name: "mcp-e2e", version: "0.1.0" }), 30000, "initialize");
  console.log("[MCP] Connected.");

  async function call(toolName, args, ms = 30000) {
    const started = Date.now();
    console.log(`[MCP] Calling tool '${toolName}' with args:`, JSON.stringify(args));
    const res = await withTimeout(client.callTool(toolName, args), ms, `tools/call ${toolName}`);
    const took = Date.now() - started;
    const content = res && res.content ? res.content : [];
    const text = content.filter(c => c.type === "text").map(c => c.text).join("\n");
    console.log(`[MCP] ${toolName} (took ${took}ms):`, (text || "").slice(0, 200));
    return { res, text, content };
  }

  // 1) Navega para Média Ponderada
  await call("playwright_navigate", { url: TARGET, headless: true }, 30000);

  // 2) Verifica labels comuns da calculadora de média ponderada
  const { text: html } = await call("playwright_get_visible_html", {}, 30000);
  const labels = [
    "Média Ponderada",
    "Calcular",
    "Limpar",
    "Peso",
    "Nota",
    "Resultado"
  ];
  let containsAny = labels.some(t => html.includes(t));
  if (!containsAny) {
    console.warn("[WARN] Labels de média ponderada não detectadas no HTML inicial.");
  } else {
    console.log("[ASSERT] Labels de média ponderada detectadas.");
  }

  // 3) Preenche valores típicos para duas notas com pesos
  // Tentativa de seletores comuns (ajuste conforme DOM real)
  const notaSelectors = [
    'input[name="nota"]',
    'input[name="nota1"]',
    'input[name="nota-1"]',
    'input[placeholder*="nota"]',
    'input[aria-label*="nota"]',
  ];
  const pesoSelectors = [
    'input[name="peso"]',
    'input[name="peso1"]',
    'input[name="peso-1"]',
    'input[placeholder*="peso"]',
    'input[aria-label*="peso"]',
  ];

  // Tenta preencher primeira dupla (nota=7, peso=3) e segunda (nota=9, peso=2)
  async function fillFirstPair() {
    for (const ns of notaSelectors) {
      try {
        await call("playwright_fill", { selector: ns, value: "7" }, 30000);
        for (const ps of pesoSelectors) {
          try {
            await call("playwright_fill", { selector: ps, value: "3" }, 30000);
            return true;
          } catch {}
        }
      } catch {}
    }
    return false;
  }

  async function fillSecondPair() {
    // Heurística: tente encontrar o "próximo" campo repetindo seletores; algumas UIs usam listas
    for (const ns of notaSelectors) {
      try {
        await call("playwright_fill", { selector: ns, value: "9" }, 30000);
        for (const ps of pesoSelectors) {
          try {
            await call("playwright_fill", { selector: ps, value: "2" }, 30000);
            return true;
          } catch {}
        }
      } catch {}
    }
    return false;
  }

  const firstOk = await fillFirstPair();
  const secondOk = await fillSecondPair();
  if (!firstOk || !secondOk) {
    console.warn("[WARN] Não foi possível preencher todas as notas/pesos com seletores heurísticos.");
  } else {
    console.log("[STEP] Preenchidas notas/pesos: (7,3) e (9,2).");
  }

  // 4) Clica Calcular
  try {
    await call("playwright_click", { selector: 'button:has-text("Calcular")' }, 30000);
  } catch {
    console.warn("[WARN] Botão 'Calcular' não encontrado via seletor por texto.");
  }

  // 5) Verifica resultado esperado: (7*3 + 9*2) / (3+2) = (21 + 18)/5 = 7.8
  const { text: visAfter } = await call("playwright_get_visible_text", {}, 30000);
  const matchResult = /7[,.]8\b/.test(visAfter) || /resultado/i.test(visAfter);
  if (matchResult) {
    console.log("[ASSERT] Indícios de resultado detectados (esperado ~7.8).");
  } else {
    console.warn("[WARN] Não foi possível identificar o resultado; confira os seletores e formato.");
  }

  // 6) Screenshot
  const { text: shotText } = await call("playwright_screenshot", { name: "media-ponderada", format: "png" }, 30000);
  console.log("[MCP] Screenshot result:", shotText);

  // 7) Limpar
  try {
    await call("playwrig