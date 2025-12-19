const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'client_secret.json');

async function main() {
  try {
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
    oAuth2Client.setCredentials(token);

    const searchconsole = google.webmasters({
      version: 'v3',
      auth: oAuth2Client,
    });

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 28);

    const formatDate = (d) => d.toISOString().split('T')[0];

    console.log('='.repeat(80));
    console.log('ANÁLISE COMPLETA DO GOOGLE SEARCH CONSOLE - mycalconline.com');
    console.log('Período:', formatDate(startDate), 'até', formatDate(endDate));
    console.log('='.repeat(80));

    // 1. Top Queries (100)
    console.log('\n📊 TOP 100 QUERIES (por impressões):\n');
    const queriesRes = await searchconsole.searchanalytics.query({
      siteUrl: 'https://mycalconline.com/',
      requestBody: {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        dimensions: ['query'],
        rowLimit: 100,
      },
    });

    if (queriesRes.data.rows) {
      console.log('Query | Clicks | Impressions | CTR% | Position');
      console.log('-'.repeat(80));
      queriesRes.data.rows.forEach(row => {
        const query = row.keys[0].substring(0, 50).padEnd(50);
        const ctr = (row.ctr * 100).toFixed(2);
        const position = row.position.toFixed(1);
        console.log(`${query} | ${String(row.clicks).padStart(6)} | ${String(row.impressions).padStart(10)} | ${ctr.padStart(5)} | ${position.padStart(5)}`);
      });
    }

    // 2. Top Pages
    console.log('\n\n📄 TOP PÁGINAS (por impressões):\n');
    const pagesRes = await searchconsole.searchanalytics.query({
      siteUrl: 'https://mycalconline.com/',
      requestBody: {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        dimensions: ['page'],
        rowLimit: 50,
      },
    });

    if (pagesRes.data.rows) {
      console.log('URL | Clicks | Impressions | CTR% | Position');
      console.log('-'.repeat(100));
      pagesRes.data.rows.forEach(row => {
        const page = row.keys[0].replace('https://mycalconline.com', '');
        const ctr = (row.ctr * 100).toFixed(2);
        const position = row.position.toFixed(1);
        console.log(`${page.substring(0, 60).padEnd(60)} | ${String(row.clicks).padStart(6)} | ${String(row.impressions).padStart(10)} | ${ctr.padStart(5)} | ${position.padStart(5)}`);
      });
    }

    // 3. Query + Page combinado (para ver que keywords levam a quais páginas)
    console.log('\n\n🔗 QUERIES POR PÁGINA (top oportunidades):\n');
    const combinedRes = await searchconsole.searchanalytics.query({
      siteUrl: 'https://mycalconline.com/',
      requestBody: {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        dimensions: ['query', 'page'],
        rowLimit: 200,
      },
    });

    if (combinedRes.data.rows) {
      console.log('Query | Page | Clicks | Impressions | CTR% | Position');
      console.log('-'.repeat(120));
      combinedRes.data.rows.forEach(row => {
        const query = row.keys[0].substring(0, 35).padEnd(35);
        const page = row.keys[1].replace('https://mycalconline.com', '').substring(0, 40).padEnd(40);
        const ctr = (row.ctr * 100).toFixed(2);
        const position = row.position.toFixed(1);
        console.log(`${query} | ${page} | ${String(row.clicks).padStart(5)} | ${String(row.impressions).padStart(8)} | ${ctr.padStart(5)} | ${position.padStart(5)}`);
      });
    }

    // 4. Países
    console.log('\n\n🌍 TOP PAÍSES:\n');
    const countryRes = await searchconsole.searchanalytics.query({
      siteUrl: 'https://mycalconline.com/',
      requestBody: {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        dimensions: ['country'],
        rowLimit: 20,
      },
    });

    if (countryRes.data.rows) {
      console.log('País | Clicks | Impressions | CTR% | Position');
      console.log('-'.repeat(60));
      countryRes.data.rows.forEach(row => {
        const country = row.keys[0].padEnd(10);
        const ctr = (row.ctr * 100).toFixed(2);
        const position = row.position.toFixed(1);
        console.log(`${country} | ${String(row.clicks).padStart(6)} | ${String(row.impressions).padStart(10)} | ${ctr.padStart(5)} | ${position.padStart(5)}`);
      });
    }

    // 5. Dispositivos
    console.log('\n\n📱 DISPOSITIVOS:\n');
    const deviceRes = await searchconsole.searchanalytics.query({
      siteUrl: 'https://mycalconline.com/',
      requestBody: {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        dimensions: ['device'],
        rowLimit: 10,
      },
    });

    if (deviceRes.data.rows) {
      console.log('Device | Clicks | Impressions | CTR% | Position');
      console.log('-'.repeat(60));
      deviceRes.data.rows.forEach(row => {
        const device = row.keys[0].padEnd(10);
        const ctr = (row.ctr * 100).toFixed(2);
        const position = row.position.toFixed(1);
        console.log(`${device} | ${String(row.clicks).padStart(6)} | ${String(row.impressions).padStart(10)} | ${ctr.padStart(5)} | ${position.padStart(5)}`);
      });
    }

    // 6. OPORTUNIDADES: Queries com alta impressão mas baixo CTR ou posição ruim
    console.log('\n\n🎯 OPORTUNIDADES DE OTIMIZAÇÃO (posição 5-20, alto volume):\n');
    if (queriesRes.data.rows) {
      const opportunities = queriesRes.data.rows
        .filter(row => row.position >= 5 && row.position <= 20 && row.impressions >= 50)
        .sort((a, b) => b.impressions - a.impressions)
        .slice(0, 30);

      console.log('Query | Clicks | Impressions | CTR% | Position | Potencial');
      console.log('-'.repeat(100));
      opportunities.forEach(row => {
        const query = row.keys[0].substring(0, 40).padEnd(40);
        const ctr = (row.ctr * 100).toFixed(2);
        const position = row.position.toFixed(1);
        const potencial = Math.round(row.impressions * 0.1); // estimativa se chegasse ao top 3
        console.log(`${query} | ${String(row.clicks).padStart(5)} | ${String(row.impressions).padStart(8)} | ${ctr.padStart(5)} | ${position.padStart(5)} | +${potencial} clicks`);
      });
    }

    // 7. Quick Wins: Posição 8-15 com bom volume
    console.log('\n\n⚡ QUICK WINS (posição 8-15, fácil subir):\n');
    if (queriesRes.data.rows) {
      const quickWins = queriesRes.data.rows
        .filter(row => row.position >= 8 && row.position <= 15 && row.impressions >= 30)
        .sort((a, b) => a.position - b.position)
        .slice(0, 20);

      console.log('Query | Position | Impressions | Clicks');
      console.log('-'.repeat(80));
      quickWins.forEach(row => {
        const query = row.keys[0].substring(0, 45).padEnd(45);
        const position = row.position.toFixed(1);
        console.log(`${query} | ${position.padStart(5)} | ${String(row.impressions).padStart(8)} | ${row.clicks}`);
      });
    }

    console.log('\n' + '='.repeat(80));
    console.log('FIM DA ANÁLISE');
    console.log('='.repeat(80));

  } catch (err) {
    console.error('Error:', err.message);
    if (err.response) {
      console.error('Response data:', err.response.data);
    }
  }
}

main();
