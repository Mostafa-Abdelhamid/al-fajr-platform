import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "TEACHER") {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const { dayOfWeek, startTime, endTime } = await req.json();
  if (dayOfWeek === undefined || !startTime || !endTime) {
    return NextResponse.json({ error: "بيانات ناقصة" }, { status: 400 });
  }
  if (startTime >= endTime) {
    return NextResponse.json({ error: "وقت البداية يجب أن يكون قبل وقت النهاية" }, { status: 400 });
  }

  const profile = await prisma.teacherProfile.findUnique({ where: { userId: user.id } });
  if (!profile) {
    return NextResponse.json({ error: "لم يتم العثور على الملف التعريفي" }, { status: 404 });
  }

  const availability = await prisma.availability.create({
    data: { teacherId: profile.id, dayOfWeek, startTime, endTime },
  });

  return NextResponse.json({ ok: true, availability });
}
