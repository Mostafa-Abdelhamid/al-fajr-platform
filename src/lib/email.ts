/**
 * Minimal email sender. If RESEND_API_KEY is configured, sends via Resend's
 * HTTP API (https://resend.com — free tier, no SMTP setup needed). Otherwise
 * falls back to logging the email to the server console, so the OTP flow is
 * still fully testable locally/without a provider configured yet.
 */
export async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "منصة الفجر <onboarding@resend.dev>";

  if (!apiKey) {
    console.log(`\n--- [DEV] بريد إلكتروني (لا يوجد مزوّد بريد مُهيّأ) ---`);
    console.log(`إلى: ${to}`);
    console.log(`الموضوع: ${subject}`);
    console.log(html.replace(/<[^>]+>/g, " "));
    console.log(`--- نهاية البريد ---\n`);
    return { ok: true, dev: true };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Failed to send email via Resend:", text);
    return { ok: false, dev: false };
  }

  return { ok: true, dev: false };
}

export function otpEmailHtml(code: string) {
  return `
    <div dir="rtl" style="font-family:sans-serif;max-width:420px;margin:0 auto">
      <h2 style="color:#121833">🌅 منصة الفجر</h2>
      <p>رمز إعادة تعيين كلمة المرور الخاص بك هو:</p>
      <p style="font-size:28px;font-weight:bold;letter-spacing:4px;color:#f2704a">${code}</p>
      <p style="color:#6b7089;font-size:13px">هذا الرمز صالح لمدة 10 دقائق. إن لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذه الرسالة.</p>
    </div>
  `;
}
