require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const nodemailer = require("nodemailer");

app.use(cors());

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: process.env.AUTH_EMAIl,
    pass: process.env.AUTH_PASSWORD,
  },
});
// verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});
app.post("/send", async (req, res, next) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }
  // Create mail options
  const mailOptions = {
    from: name,
    to: "samueladeyemi2006@gmail.com",
    replyTo: email,
    subject: "New message - portfolio",
    text: message,
    html: `
			<h1>New message from ${email}</h1>
			<h2>Name:</h2>
			<h3>${name}</h3>
			<h2>Message:</h2>
			<h3>${message}</h3>
		`,
  };
  try {
    await transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      return res.status(200).json({ message: "Email sent" });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
