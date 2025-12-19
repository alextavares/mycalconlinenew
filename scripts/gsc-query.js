
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

    const res = await searchconsole.searchanalytics.query({
      siteUrl: 'https://mycalconline.com/',
      requestBody: {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        dimensions: ['query'],
        rowLimit: 10,
      },
    });

    console.log('Top 10 Queries for https://mycalconline.com/ (Last 28 Days):');
    console.log('Query | Clicks | Impressions | CTR (%) | Position');
    console.log('--- | --- | --- | --- | ---');
    
    if (res.data.rows && res.data.rows.length > 0) {
      res.data.rows.forEach(row => {
        const query = row.keys[0];
        const ctr = (row.ctr * 100).toFixed(2);
        const position = row.position.toFixed(2);
        console.log(`${query} | ${row.clicks} | ${row.impressions} | ${ctr} | ${position}`);
      });
    } else {
      console.log('No query data available for the last 28 days.');
    }

  } catch (err) {
    console.error('Error performing query:', err);
  }
}

main().catch(console.error);
