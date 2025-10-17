// import { createTransport } from "nodemailer"

// export const transporter = createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// })

// lib/email.ts
import nodemailer, { Transporter } from "nodemailer"

// ✅ Create the transporter (TypeScript-safe)
export const transporter: Transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true only for port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

// ✅ Verify transporter at startup (helps debug Gmail issues)
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email transporter failed:", (error as Error).message)
  } else {
    console.log("✅ Email transporter ready to send mail")
  }
})
