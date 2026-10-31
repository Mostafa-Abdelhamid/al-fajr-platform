import dns from "dns/promises";
import type { Locale } from "@/i18n/config";
import { makeT } from "@/i18n/t";
import { apiMessages } from "@/i18n/dictionaries/apiMessages";

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
export async function assertRealEmail(email: string, locale: Locale): Promise<string | null> {
  const t = makeT(apiMessages, locale);
  const trimmed = email.trim().toLowerCase();

  if (!EMAIL_REGEX.test(trimmed)) {
    return t("invalidEmail");
  }

  const domain = trimmed.split("@")[1];
  if (BLOCKED_DOMAINS.has(domain)) {
    return t("useRealEmail");
  }

  try {
    const mx = await dns.resolveMx(domain);
    if (!mx || mx.length === 0) {
      return t("noMailServerForDomain");
    }
  } catch {
    return t("noMailServerForDomain");
  }

  return null;
}
