const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
require("dotenv").config();

const OAuth2 = google.auth.OAuth2;

const PORT = 4000;
const app = express();

app.use(express.json());
app.post("/", function (req, res) {
  const { email } = req.body;
    res.send({ message: "Default route in email tutorial project" });
  const myOAuth2Client = new OAuth2(
    process.env.CLIENTID,
    process.env.CLIENTSECRET,
    "https://developers.google.com/oauthplayground"
  );
  console.log(myOAuth2Client);
  myOAuth2Client.setCredentials({
    refresh_token: process.env.RSHTOKEN,
  });
  console.log(myOAuth2Client);
  const myAccessToken = async () => {
      try{
        myOAuth2Client.getAccessToken();

      }catch(error){
        console.log(error);
      }
  };

  console.log(myAccessToken);

  const transport = nodemailer.createTransport({
    // @ts-ignore
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL, //your gmail account you used to set the project up in google cloud console"
      clientId: process.env.CLIENTID,
      clientSecret: process.env.CLIENTSECRET,
      refreshToken: process.env.RSHTOKEN,
      accessToken: myAccessToken, //access token variable we defined earlier
    },
  });

  const mailOptions = {
    from: "youremailaddresshere@email.com", // sender
    to: req.body.email, // receiver
    subject: "My tutorial brought me here", // Subject
    html:
      "<p>You have received this email using nodemailer, you are welcome ;)</p>",
  };

  transport.sendMail(mailOptions, function (err, result) {
    if (err) {
      res.send({
        message: err,
      });
    } else {
      transport.close();
      res.send({
        message: "Email has been sent: check your inbox!",
      });
    }
  });
});

app.listen(PORT, function (req, res) {
  console.log(`Listening on port ${PORT}`);
});
