const express = require("express");
const path = require("path");
const Mailjet = require("node-mailjet");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = "127.0.0.1";

const mailjet = Mailjet.apiConnect(
  process.env.MAILJET_API_KEY,
  process.env.MAILJET_SECRET_KEY
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

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
            New Contact Form Submission\n\n
            Name: ${name}\n
            Email: ${email}\n
            Subject: ${subject}\n
            Message:\n${message}\n\n
            This message was sent from the ACMS website contact form.
          `,
        },
      ],
    });

    console.log("Email sent successfully:", request.body);
    res.json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);

    if (error.statusCode) {
      return res.status(500).json({
        error: "Failed to send message. Please try again later.",
      });
    }

    res.status(500).json({
      error: "Internal server error. Please try again later.",
    });
  }
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    time: new Date().toISOString(),
  });
});

app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});
