const nodemailer = require('nodemailer');
const { google } = require('googleapis');

// These id's and secrets should come from .env file.
const CLIENT_ID = '232014406316-i9mi5352gc7mp5goe7udav07c93v0fgo.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04UO7UE5_-ANJCgYIARAAGAQSNwF-L9IrKsuVFjq4oAMb5_Mr7Rv_cNL3LMsY8b4JRGm0sMKoIAWaNYEvs8Egrx2NXHkegGCyn_A';

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMail() {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'seniordesignemailbot@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: 'Alex Dong seniordesignemailbot@gmail.com',
      to: 'alexdong040201@gmail.com',
      subject: 'Hello from gmail using API',
      text: 'second test 2',
      html: '<h2>second test</h2>',
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    return error;
  }
}

sendMail()
  .then((result) => console.log('Email sent...', result))
  .catch((error) => console.log(error.message));