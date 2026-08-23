// TODO: Set NOTIFICATION_EMAIL and RESEND_API_KEY as environment secrets in Supabase before this goes live — get a free Resend account and API key first

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  record: {
    id: string;
    name: string;
    email: string;
    subject?: string;
    message: string;
    submitted_at?: string;
  };
  schema: string;
  old_record: unknown;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// @ts-ignore
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const payload: WebhookPayload = await req.json();
    console.log("Received database webhook for table:", payload.table, "type:", payload.type);

    const record = payload.record;
    if (!record || !record.email || !record.message) {
      return new Response(
        JSON.stringify({ error: "Invalid webhook payload: missing record fields" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const notificationEmail = Deno.env.get("NOTIFICATION_EMAIL") || "press@aadityaajay.com";

    if (!resendApiKey) {
      console.warn("RESEND_API_KEY is not set in environment secrets. Email notification skipped.");
      return new Response(
        JSON.stringify({
          message: "Webhook received, but RESEND_API_KEY secret is not configured.",
          recordId: record.id
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const emailSubject = `New Press Inquiry: ${record.subject || 'Website Submission'}`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; rounded: 8px;">
        <h2 style="color: #C81E3A; border-bottom: 2px solid #C81E3A; padding-bottom: 10px;">New Contact Inquiry Received</h2>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 120px; color: #555;">From:</td>
            <td style="padding: 8px 0;">${record.name} (&lt;<a href="mailto:${record.email}">${record.email}</a>&gt;)</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Subject:</td>
            <td style="padding: 8px 0;">${record.subject || 'No Subject'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Submitted At:</td>
            <td style="padding: 8px 0;">${new Date().toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' })}</td>
          </tr>
        </table>

        <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #C81E3A; border-radius: 4px;">
          <h4 style="margin-top: 0; color: #333;">Message:</h4>
          <p style="white-space: pre-wrap; color: #222; font-size: 14px; line-height: 1.6;">${record.message}</p>
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
        reply_to: record.email,
      }),
    });

    const resendData = await resendRes.json();

    if (!resendRes.ok) {
      console.error("Resend API error:", resendData);
      return new Response(
        JSON.stringify({ error: "Resend API returned error", details: resendData }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Email notification sent successfully:", resendData);

    return new Response(
      JSON.stringify({ success: true, resendId: resendData.id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error("Error processing webhook:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
