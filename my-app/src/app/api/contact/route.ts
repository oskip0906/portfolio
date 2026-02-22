import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: Request) {
  try {
    const { message, senderName, senderEmail } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS

    if (!smtpUser || !smtpPass) {
      console.error("Missing SMTP environment variables")
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 })
    }

    const fromLine = senderName || senderEmail
      ? `From: ${[senderName, senderEmail].filter(Boolean).join(" — ")}\n\n`
      : ""
    const fullMessage = `${fromLine}${message}`

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    })

    await transporter.sendMail({
      from: smtpUser,
      to: smtpUser,
      subject: "New message from your website!",
      text: fullMessage,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Failed to send contact message:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
