import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSessionCookie } from "@/lib/auth";
import { assertRealEmail } from "@/lib/emailCheck";
import { getLocale } from "@/i18n/getLocale";
import { makeT } from "@/i18n/t";
import { apiMessages } from "@/i18n/dictionaries/apiMessages";

export async function POST(req: NextRequest) {
  const locale = await getLocale();
  const t = makeT(apiMessages, locale);

  const body = await req.json();
  const { name, email, password, role, qiraat } = body as {
    name: string;
    email: string;
    password: string;
    role: "STUDENT" | "TEACHER";
    qiraat?: string[];
  };

  if (!name || !email || !password || !role) {
    return NextResponse.json({ error: t("fillAllFields") }, { status: 400 });
  }

  const emailError = await assertRealEmail(email, locale);
  if (emailError) {
    return NextResponse.json({ error: emailError }, { status: 400 });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    return NextResponse.json(
      { error: t("emailAlreadyRegistered") },
      { status: 400 }
    );
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email: normalizedEmail,
      password: hashed,
      role,
      avatarEmoji: role === "TEACHER" ? "👨‍🏫" : "🧑‍🎓",
      ...(role === "TEACHER"
        ? {
            teacherProfile: {
              create: {
                qiraat: qiraat && qiraat.length > 0 ? qiraat : ["حفص عن عاصم"],
                bio: "معلم جديد على منصة الفجر",
              },
            },
          }
        : {}),
    },
  });

  await createSessionCookie({ userId: user.id, role: user.role as "STUDENT" | "TEACHER" });

  return NextResponse.json({ ok: true, role: user.role });
}
