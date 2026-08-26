import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields (name, email, message)" },
        { status: 400 }
      );
    }

    const senderEmail = process.env.GMAIL_SENDER_EMAIL;
    const appPassword = process.env.GMAIL_APP_PASSWORD;
    const recipientEmail = process.env.NOTIFICATION_EMAIL || "journalistaaditya786@gmail.com";

    if (!senderEmail || !appPassword) {
      console.warn("GMAIL_SENDER_EMAIL or GMAIL_APP_PASSWORD environment variable is not configured.");
      return NextResponse.json(
        { error: "Gmail SMTP environment variables not configured" },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: senderEmail,
        pass: appPassword,
      },
    });

    const emailSubject = `New Press Inquiry: ${subject || "Website Submission"}`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #C81E3A; border-bottom: 2px solid #C81E3A; padding-bottom: 10px; margin-top: 0;">New Press Inquiry</h2>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 120px; color: #555;">From:</td>
            <td style="padding: 8px 0;">${name} (&lt;<a href="mailto:${email}">${email}</a>&gt;)</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Subject:</td>
            <td style="padding: 8px 0;">${subject || "No Subject"}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Submitted At:</td>
            <td style="padding: 8px 0;">${new Date().toLocaleString("en-US", { timeZone: "Asia/Kathmandu" })}</td>
          </tr>
        </table>

        <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #C81E3A; border-radius: 4px;">
          <h4 style="margin-top: 0; color: #333;">Message:</h4>
          <blockquote style="margin: 0; white-space: pre-wrap; color: #222; font-size: 14px; line-height: 1.6;">
            ${message}
          </blockquote>
        </div>

        <p style="margin-top: 25px; font-size: 12px; color: #888; text-align: center;">
          This is an automated alert sent from your Aaditya Ajay Editorial Portfolio website.
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Aaditya Ajay Portfolio" <${senderEmail}>`,
      to: recipientEmail,
      replyTo: email,
      subject: emailSubject,
      html: emailHtml,
    });

    console.log("Inquiry notification email sent via Gmail SMTP to:", recipientEmail);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to send notification email:", error);
    return NextResponse.json(
      { error: "Failed to send email", details: String(error) },
      { status: 500 }
    );
  }
}
