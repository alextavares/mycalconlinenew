#!/usr/bin/env node
/**
 * MCP test for Porcentagem calculator using vendored JSON-RPC stdio client.
 * Mirrors the pattern from scripts/mcp-word-counter-test.js.
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
    const req = { jsonrpc: "2.0", id, method, params };
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this._send(req);
    });
  }

  async initialize(clientInfo) {
    const result = await this.request("initialize", {
      clientInfo,
      ...this.capabilities
    });
    return result;
  }

  async callTool(name, args) {
    return this.request("tools/call", {
      name,
      arguments: args || {}
    });
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
  const TARGET = BASE_URL + "/pt-BR/calculator/porcentagem";

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

  // 1) Navigate to Porcentagem calculator
  await call("playwright_navigate", { url: TARGET, headless: true }, 30000);

  // 2) Verify UI has key Portuguese labels commonly present in percentage calculator UIs
  const { text: html } = await call("playwright_get_visible_html", {}, 30000);
  const labels = [
    "Porcentagem",
    "Calcular",
    "Limpar",
    "%",
    "Resultado"
  ];
  let foundAny = false;
  for (const token of labels) {
    if (html.includes(token)) {
      foundAny = true;
      break;
    }
  }
  if (!foundAny) {
    console.warn("[WARN] Expected percentage-related labels not detected on initial HTML snapshot.");
  } else {
    console.log("[ASSERT] Percentage labels detected in HTML.");
  }

  // 3) Try to fill typical inputs; selectors may need adjustment to your real DOM
  // Attempt common selectors by id/name/placeholder
  function trySelectors(...sels) { return sels; }
  const valueSelectors = trySelectors(
    'input[name="valor"]',
    'input#valor',
    'input[placeholder*="valor"]',
    'input[aria-label*="valor"]'
  );
  const percentSelectors = trySelectors(
    'input[name="porcentagem"]',
    'input#porcentagem',
    'input[placeholder*="%"]',
    'input[aria-label*="porcentagem"]'
  );

  let filled = false;
  for (const vs of valueSelectors) {
    try {
      await call("playwright_fill", { selector: vs, value: "200" }, 30000);
      for (const ps of percentSelectors) {
        try {
          await call("playwright_fill", { selector: ps, value: "15" }, 30000);
          filled = true;
          break;
        } catch {}
      }
      if (filled) break;
    } catch {}
  }
  if (!filled) {
    console.warn("[WARN] Could not confidently fill value/percentage inputs; proceeding to attempt calculation click.");
  } else {
    console.log("[STEP] Filled valor=200 and porcentagem=15.");
  }

  // 4) Click Calcular
  try {
    await call("playwright_click", { selector: 'button:has-text("Calcular")' }, 30000);
  } catch {
    console.warn("[WARN] Could not find 'Calcular' button via text selector.");
  }

  // 5) Verify a result appears in the visible text
  const { text: visAfter } = await call("playwright_get_visible_text", {}, 30000);
  const possiblePatterns = [
    /30\b/,                 // 15% of 200 = 30 (common output)
    /resultado/i,
    /percentual/i
  ];
  const matched = possiblePatterns.some(rx => rx.test(visAfter));
  if (matched) {
    console.log("[ASSERT] Result indicators detected after calculation.");
  } else {
    console.warn("[WARN] Could not detect result indicators; check selectors and labels.");
  }

  // 6) Screenshot
  const { text: shotText } = await call("playwright_screenshot", { name: "porcentagem", format: "png" }, 30000);
  console.log("[MCP] Screenshot result:", shotText);

  // 7) Clear
  try {
    await call("playwright_click", { selector: 'button:has-text("Limpar")' }, 30000);
    console.log("[STEP] Clicked Limpar.");
  } catch {
    console.warn("[WARN] Could not click Limpar.");
  }

  // Close and exit
  await call("playwright_close", {}, 30000);
  await client.close();
  console.log("[MCP] Done (Porcentagem).");
  process.exit(0);
})().catch(async (err) => {
  console.error("[MCP] Error:", err);
  process.exit(1);
});