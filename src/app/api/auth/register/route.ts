import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSessionCookie } from "@/lib/auth";
import { assertRealEmail } from "@/lib/emailCheck";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, password, role, qiraat } = body as {
    name: string;
    email: string;
    password: string;
    role: "STUDENT" | "TEACHER";
    qiraat?: string;
  };

  if (!name || !email || !password || !role) {
    return NextResponse.json({ error: "الرجاء تعبئة جميع الحقول" }, { status: 400 });
  }

  const emailError = await assertRealEmail(email);
  if (emailError) {
    return NextResponse.json({ error: emailError }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "هذا البريد الإلكتروني مسجل مسبقًا" },
      { status: 400 }
    );
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      role,
      avatarEmoji: role === "TEACHER" ? "👨‍🏫" : "🧑‍🎓",
      ...(role === "TEACHER"
        ? {
            teacherProfile: {
              create: {
                qiraat: qiraat || "حفص عن عاصم",
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
