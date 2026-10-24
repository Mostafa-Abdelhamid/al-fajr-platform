import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { assertRealEmail } from "@/lib/emailCheck";
import { sendEmail, otpEmailHtml } from "@/lib/email";

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: "الرجاء إدخال البريد الإلكتروني" }, { status: 400 });
  }

  const emailError = await assertRealEmail(email);
  if (emailError) {
    return NextResponse.json({ error: emailError }, { status: 400 });
  }

  const normalized = String(email).trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalized } });

  // Always respond the same way whether or not the account exists,
  // so this endpoint can't be used to find out which emails are registered.
  const genericResponse = NextResponse.json({
    ok: true,
    message: "إذا كان هذا البريد مسجلًا لدينا، سيصلك رمز التحقق خلال لحظات.",
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

  await sendEmail(normalized, "رمز إعادة تعيين كلمة المرور — منصة الفجر", otpEmailHtml(code));

  return genericResponse;
}
