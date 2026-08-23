# Supabase Edge Function: `notify-new-inquiry`

This Edge Function listens for Database Webhooks triggered when a new row is inserted into the `contact_inquiries` table, and sends an automated email notification via [Resend](https://resend.com).

---

## 🛠️ Setup & Deployment Instructions

### 1. Set Environment Secrets in Supabase
Run the following commands using the Supabase CLI (or add them via **Project Settings → Edge Functions → Secrets** in the Supabase Dashboard):

```bash
# TODO: Set NOTIFICATION_EMAIL and RESEND_API_KEY as environment secrets in Supabase before this goes live — get a free Resend account and API key first
npx supabase secrets set RESEND_API_KEY="re_123456789..."
npx supabase secrets set NOTIFICATION_EMAIL="your-email@example.com"
```

### 2. Deploy the Edge Function
```bash
npx supabase functions deploy notify-new-inquiry --no-verify-jwt
```

### 3. Configure Database Webhook in Supabase Dashboard
1. Go to **Supabase Dashboard → Database → Webhooks**.
2. Click **Create a new webhook**.
3. Set the details:
   - **Name**: `notify-new-inquiry-webhook`
   - **Table**: `public.contact_inquiries`
   - **Events**: Check `INSERT`
   - **Type**: HTTP Request
   - **Method**: POST
   - **URL**: `https://<YOUR_SUPABASE_PROJECT_REF>.supabase.co/functions/v1/notify-new-inquiry`
   - **HTTP Headers**: Add `Content-Type: application/json`
4. Click **Save**.

Now, whenever a visitor submits a contact form on the public site, a row is saved to `contact_inquiries` and an email notification is automatically dispatched to your inbox!
