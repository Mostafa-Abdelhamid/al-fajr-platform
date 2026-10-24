import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const MAX_ATTEMPTS = 5;

export async function POST(req: NextRequest) {
  const { email, code, newPassword } = await req.json();
  if (!email || !code || !newPassword) {
    return NextResponse.json({ error: "الرجاء تعبئة جميع الحقول" }, { status: 400 });
  }
  if (String(newPassword).length < 6) {
    return NextResponse.json({ error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }, { status: 400 });
  }

  const normalized = String(email).trim().toLowerCase();

  const otp = await prisma.passwordResetOtp.findFirst({
    where: { email: normalized, used: false },
    orderBy: { createdAt: "desc" },
  });

  if (!otp || otp.expiresAt < new Date()) {
    return NextResponse.json({ error: "رمز التحقق غير صالح أو منتهي الصلاحية" }, { status: 400 });
  }

  if (otp.attempts >= MAX_ATTEMPTS) {
    await prisma.passwordResetOtp.update({ where: { id: otp.id }, data: { used: true } });
    return NextResponse.json({ error: "تم تجاوز عدد المحاولات المسموح، اطلب رمزًا جديدًا" }, { status: 400 });
  }

  const valid = await bcrypt.compare(String(code), otp.codeHash);
  if (!valid) {
    await prisma.passwordResetOtp.update({ where: { id: otp.id }, data: { attempts: { increment: 1 } } });
    return NextResponse.json({ error: "رمز التحقق غير صحيح" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: normalized } });
  if (!user) {
    return NextResponse.json({ error: "تعذر العثور على الحساب" }, { status: 400 });
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.$transaction([
    prisma.user.update({ where: { id: user.id }, data: { password: hashed } }),
    prisma.passwordResetOtp.update({ where: { id: otp.id }, data: { used: true } }),
  ]);

  return NextResponse.json({ ok: true });
}
