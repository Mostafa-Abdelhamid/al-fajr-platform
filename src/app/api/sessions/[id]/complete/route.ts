import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rewardStudentForCompletedSession } from "@/lib/gamification";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "TEACHER") {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const { id } = await params;
  const { teacherNotes, rating } = await req.json();

  const session = await prisma.session.findUnique({ where: { id } });
  if (!session || session.teacherId !== user.id) {
    return NextResponse.json({ error: "غير موجود" }, { status: 404 });
  }
  if (session.status === "COMPLETED") {
    return NextResponse.json({ error: "هذه الحصة مكتملة بالفعل" }, { status: 400 });
  }

  await prisma.session.update({
    where: { id },
    data: {
      status: "COMPLETED",
      teacherNotes: teacherNotes || "",
      rating: rating ? Number(rating) : null,
    },
  });

  if (rating) {
    const profile = await prisma.teacherProfile.findUnique({ where: { userId: user.id } });
    if (profile) {
      const newCount = profile.ratingCount + 1;
      const newAvg = (profile.rating * profile.ratingCount + Number(rating)) / newCount;
      await prisma.teacherProfile.update({
        where: { id: profile.id },
        data: { rating: newAvg, ratingCount: newCount },
      });
    }
  }

  const reward = await rewardStudentForCompletedSession(session.studentId);

  return NextResponse.json({ ok: true, reward });
}
