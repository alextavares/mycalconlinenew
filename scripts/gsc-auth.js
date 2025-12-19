
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'client_secret.json');

const SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly'];

async function main() {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  const redirectUrl = process.argv[2];
  if (!redirectUrl) {
    console.error('Please provide the full redirect URL as an argument.');
    return;
  }

  const url = new URL(redirectUrl);
  const code = url.searchParams.get('code');

  if (!code) {
    console.error('Could not find "code" in the redirect URL.');
    return;
  }

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
    console.log('Token stored to', TOKEN_PATH);
  } catch (err) {
    console.error('Error while trying to retrieve access token', err);
  }
}

main().catch(console.error);
