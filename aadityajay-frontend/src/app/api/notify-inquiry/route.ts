import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body || {};

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields (name, email, message)" },
        { status: 400 }
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const notificationEmail = process.env.NOTIFICATION_EMAIL || "press@aadityaajay.com";

    if (!resendApiKey) {
      console.warn("RESEND_API_KEY environment variable is not configured. Email notification skipped.");
      return NextResponse.json({
        success: false,
        message: "RESEND_API_KEY is not set in environment variables.",
      });
    }

    const emailSubject = `New Press Inquiry: ${subject || 'Website Submission'}`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #C81E3A; border-bottom: 2px solid #C81E3A; padding-bottom: 10px;">New Contact Inquiry Received</h2>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 120px; color: #555;">From:</td>
            <td style="padding: 8px 0;">${name} (&lt;<a href="mailto:${email}">${email}</a>&gt;)</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Subject:</td>
            <td style="padding: 8px 0;">${subject || 'No Subject'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Submitted At:</td>
            <td style="padding: 8px 0;">${new Date().toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' })}</td>
          </tr>
        </table>

        <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #C81E3A; border-radius: 4px;">
          <h4 style="margin-top: 0; color: #333;">Message:</h4>
          <p style="white-space: pre-wrap; color: #222; font-size: 14px; line-height: 1.6;">${message}</p>
        </div>

        <p style="margin-top: 25px; font-size: 12px; color: #888; text-align: center;">
          This is an automated alert sent from your Aaditya Ajay Editorial Portfolio database.
        </p>
      </div>
    `;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Aaditya Ajay Portfolio <onboarding@resend.dev>",
        to: [notificationEmail],
        subject: emailSubject,
        html: emailHtml,
        reply_to: email,
      }),
    });

    const resendData = await resendRes.json();

    if (!resendRes.ok) {
      console.error("Resend API error:", resendData);
      return NextResponse.json(
        { error: "Resend API returned error", details: resendData },
        { status: 500 }
      );
    }

    console.log("Email notification sent successfully:", resendData);
    return NextResponse.json({ success: true, resendId: resendData.id });
  } catch (err: any) {
    console.error("Error in /api/notify-inquiry:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
