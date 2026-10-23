import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "TEACHER") {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const { studentId, surah, status } = await req.json();
  if (!studentId || !surah || !status) {
    return NextResponse.json({ error: "بيانات ناقصة" }, { status: 400 });
  }

  const taught = await prisma.session.findFirst({
    where: { teacherId: user.id, studentId },
  });
  if (!taught) {
    return NextResponse.json({ error: "لا يوجد ارتباط بهذا الطالب" }, { status: 403 });
  }

  const existing = await prisma.progress.findFirst({ where: { studentId, surah } });
  const progress = existing
    ? await prisma.progress.update({
        where: { id: existing.id },
        data: { status, updatedAt: new Date() },
      })
    : await prisma.progress.create({ data: { studentId, surah, status } });

  return NextResponse.json({ ok: true, progress });
}
