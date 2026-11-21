import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSessionCookie } from "@/lib/auth";
import { rateLimit, clientIp } from "@/lib/rateLimit";
import { getLocale } from "@/i18n/getLocale";
import { makeT } from "@/i18n/t";
import { apiMessages } from "@/i18n/dictionaries/apiMessages";

export async function POST(req: NextRequest) {
  const locale = await getLocale();
  const t = makeT(apiMessages, locale);

  // IP-based (not per-account) so a single attacker can't abuse a wrong
  // password against someone else's account as a lockout/DoS vector.
  if (!rateLimit(`login:${clientIp(req)}`, 10, 15 * 60 * 1000)) {
    return NextResponse.json({ error: t("tooManyRequests") }, { status: 429 });
  }

  const { email, password } = await req.json();
  const normalizedEmail = String(email || "").trim().toLowerCase();

  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (!user) {
    return NextResponse.json({ error: t("invalidCredentials") }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return NextResponse.json({ error: t("invalidCredentials") }, { status: 401 });
  }

  await createSessionCookie({ userId: user.id, role: user.role as "STUDENT" | "TEACHER" | "ADMIN" });

  return NextResponse.json({ ok: true, role: user.role });
}
