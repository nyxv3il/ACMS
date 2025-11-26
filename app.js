const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = "127.0.0.1";

require("./extrastuff")(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    time: new Date().toISOString(),
  });
});

app.post("/api/contact", async (req, res) => {
  const { name, email, mobile, admission, grade, subject, message } =
    req.body || {};

  if (
    !name ||
    !email ||
    !mobile ||
    !admission ||
    !grade ||
    !subject ||
    !message
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.CONTACT_FROM || process.env.SMTP_USER,
      to: process.env.CONTACT_TO || process.env.SMTP_USER,
      replyTo: email,
      subject: `[ACMS Contact] ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nMobile: ${mobile}\nAdmission Number: ${admission}\nGrade: ${grade}\n\n${message}`,
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Error sending email", error);
    res.status(500).json({ error: "Failed to send message" });
  }
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
