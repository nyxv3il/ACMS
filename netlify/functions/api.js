const express = require("express");
const serverless = require("serverless-http");
const Mailjet = require("node-mailjet");

const app = express();

/* Mailjet setup */
const mailjet = Mailjet.apiConnect(
  process.env.MAILJET_API_KEY,
  process.env.MAILJET_SECRET_KEY
);

/* Middleware */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Routes */

/* Contact form */
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const request = await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: process.env.FROM_EMAIL,
            Name: "ACMS Website Contact Form",
          },
          To: [
            {
              Email: process.env.TO_EMAIL,
              Name: "ACMS Team",
            },
          ],
          Subject: `New Contact Form Submission: ${subject}`,
          HTMLPart: `
              <h2>New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Message:</strong></p>
              <p>${message.replace(/\n/g, "<br>")}</p>
              <hr>
              <p><em>This message was sent from the ACMS website contact form.</em></p>
            `,
          TextPart: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject}
Message:
${message}

This message was sent from the ACMS website contact form.
            `,
        },
      ],
    });

    console.log("Email sent:", request.body);
    res.json({ success: true, message: "Message sent successfully" });
  } catch (err) {
    console.error("Mailjet error:", err);
    res.status(500).json({
      error: "Failed to send message. Please try again later.",
    });
  }
});

/* Health check */
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    time: new Date().toISOString(),
  });
});

/* 404 */
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

module.exports.handler = serverless(app);
