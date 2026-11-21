import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomInt } from "crypto";
import { prisma } from "@/lib/prisma";
import { assertRealEmail } from "@/lib/emailCheck";
import { sendEmail, otpEmailHtml } from "@/lib/email";
import { rateLimit, clientIp } from "@/lib/rateLimit";
import { getLocale } from "@/i18n/getLocale";
import { makeT } from "@/i18n/t";
import { apiMessages } from "@/i18n/dictionaries/apiMessages";

function generateOtp() {
  // crypto.randomInt is a CSPRNG, unlike Math.random().
  return String(randomInt(100000, 1000000));
}

export async function POST(req: NextRequest) {
  const locale = await getLocale();
  const t = makeT(apiMessages, locale);

  if (!rateLimit(`forgot-password:${clientIp(req)}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json({ error: t("tooManyRequests") }, { status: 429 });
  }

  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: t("enterEmail") }, { status: 400 });
  }

  const emailError = await assertRealEmail(email, locale);
  if (emailError) {
    return NextResponse.json({ error: emailError }, { status: 400 });
  }

  const normalized = String(email).trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalized } });

  // Always respond the same way whether or not the account exists,
  // so this endpoint can't be used to find out which emails are registered.
  const genericResponse = NextResponse.json({
    ok: true,
    message: t("otpGenericResponse"),
  });

  if (!user) return genericResponse;

  const code = generateOtp();
  const codeHash = await bcrypt.hash(code, 10);

  await prisma.passwordResetOtp.deleteMany({ where: { email: normalized, used: false } });
  await prisma.passwordResetOtp.create({
    data: {
      email: normalized,
      codeHash,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  const sent = await sendEmail(normalized, t("otpEmailSubject"), otpEmailHtml(code));
  if (!sent.ok) {
    console.error(`Password reset email failed to send to ${normalized}`);
  }

  return genericResponse;
}
