require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const nodemailer = require("nodemailer");

app.use(cors());
app.use(express.json());

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
    console.log("Server is ready");
  }
});
app.get("/", (req, res) => {
  res.status(200).send("My portfolio-contact-api");
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
    subject: "New message - portfolio",
    text: message,
    html: `
			<h2>New message from ${name}</h2>
      <div>
			<h3>Message:</h3>
			<h4>${message}</h4>
      </div>
		`,
  };
  try {
    await transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      } else {
        return res.status(200).json({ message: "Email sent" });
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
app.listen(process.env.PORT || 3000, () => {
  console.log(`Started`);
});
