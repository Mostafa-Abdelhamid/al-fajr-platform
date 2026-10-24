import dns from "dns/promises";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Domains that are syntactically valid but obviously not a real inbox.
const BLOCKED_DOMAINS = new Set([
  "example.com",
  "example.org",
  "example.net",
  "test.com",
  "mailinator.com",
  "guerrillamail.com",
  "10minutemail.com",
  "yopmail.com",
  "tempmail.com",
  "fajr.app", // our own seeded demo domain — never a real signup
]);

/**
 * Rejects obviously-fake emails: bad format, disposable/example domains,
 * or a domain with no mail server (MX record) at all. This is a best-effort
 * check (it can't confirm a specific mailbox exists), not full verification.
 */
export async function assertRealEmail(email: string): Promise<string | null> {
  const trimmed = email.trim().toLowerCase();

  if (!EMAIL_REGEX.test(trimmed)) {
    return "البريد الإلكتروني غير صالح.";
  }

  const domain = trimmed.split("@")[1];
  if (BLOCKED_DOMAINS.has(domain)) {
    return "الرجاء استخدام بريد إلكتروني حقيقي خاص بك.";
  }

  try {
    const mx = await dns.resolveMx(domain);
    if (!mx || mx.length === 0) {
      return "تعذر العثور على خادم بريد لهذا النطاق، تأكد من صحة البريد الإلكتروني.";
    }
  } catch {
    return "تعذر العثور على خادم بريد لهذا النطاق، تأكد من صحة البريد الإلكتروني.";
  }

  return null;
}
