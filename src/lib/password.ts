// Shared password policy, enforced server-side on every path that sets a
// password (register, reset-password, change-password). Client-side hints
// are just UX — this is the real control.
//
// NIST 800-63B favors length over forced character-class rules, but a
// handful of trivially-guessed passwords stay common enough that a small
// blocklist is still worth it even at 8+ characters.

const MIN_LENGTH = 8;

const COMMON_PASSWORDS = new Set([
  "12345678",
  "123456789",
  "1234567890",
  "password",
  "password1",
  "password123",
  "qwerty123",
  "qwertyuiop",
  "11111111",
  "00000000",
  "abc123456",
  "letmein123",
  "admin1234",
  "iloveyou1",
  "welcome123",
  "123123123",
]);

export type PasswordCheck =
  | { ok: true }
  | { ok: false; reason: "tooShort" | "noLetterOrNumber" | "tooCommon" };

export function checkPasswordStrength(password: string): PasswordCheck {
  if (typeof password !== "string" || password.length < MIN_LENGTH) {
    return { ok: false, reason: "tooShort" };
  }
  if (!/[a-zA-Z؀-ۿ]/.test(password) || !/[0-9]/.test(password)) {
    return { ok: false, reason: "noLetterOrNumber" };
  }
  if (COMMON_PASSWORDS.has(password.toLowerCase())) {
    return { ok: false, reason: "tooCommon" };
  }
  return { ok: true };
}

export { MIN_LENGTH as PASSWORD_MIN_LENGTH };
