require("dotenv").config();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const express = require("express");

const app = express();
app.use(express.json());

app.post("/", (req, res) => {
  const { email } = req.body;
  const createTransporter = async () => {
    const oauth2Client = new OAuth2(
      process.env.CLIENTID,
      process.env.CLIENTSECRET,
      "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.RSHTOKEN,
    });

    const accessToken = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          reject("Failed to create access token :(");
        }
        resolve(token);
      });
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL,
        accessToken,
        clientId: process.env.CLIENTID,
        clientSecret: process.env.CLIENTSECRET,
        refreshToken: process.env.RSHTOKEN,
      },
    });

    return transporter;
  };

  const sendEmail = async (emailOptions) => {
    let emailTransporter = await createTransporter();
    await emailTransporter.sendMail(emailOptions);
  };

  sendEmail({
    subject: "Test",
    text: "I am sending an email from nodemailer!",
    to: email,
    from: process.env.EMAIL,
  });
});

app.listen(3000, function (req, res) {
  console.log("Listening on port  3000");
});
