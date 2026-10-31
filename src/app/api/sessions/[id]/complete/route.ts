import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rewardStudentForCompletedSession } from "@/lib/gamification";
import { getLocale } from "@/i18n/getLocale";
import { makeT } from "@/i18n/t";
import { apiMessages } from "@/i18n/dictionaries/apiMessages";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const locale = await getLocale();
  const t = makeT(apiMessages, locale);

  const user = await getCurrentUser();
  if (!user || user.role !== "TEACHER") {
    return NextResponse.json({ error: t("unauthorized") }, { status: 401 });
  }

  const { id } = await params;
  const { teacherNotes, rating } = await req.json();

  const session = await prisma.session.findUnique({ where: { id } });
  if (!session || session.teacherId !== user.id) {
    return NextResponse.json({ error: t("notFound") }, { status: 404 });
  }
  if (session.status === "COMPLETED") {
    return NextResponse.json({ error: t("sessionAlreadyCompleted") }, { status: 400 });
  }

  await prisma.session.update({
    where: { id },
    data: {
      status: "COMPLETED",
      teacherNotes: teacherNotes || "",
      rating: rating ? Number(rating) : null,
    },
  });

  const reward = await rewardStudentForCompletedSession(session.studentId);

  return NextResponse.json({ ok: true, reward });
}
