import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rewardTeacherForStudentRating } from "@/lib/gamification";
import { getLocale } from "@/i18n/getLocale";
import { makeT } from "@/i18n/t";
import { apiMessages } from "@/i18n/dictionaries/apiMessages";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const locale = await getLocale();
  const t = makeT(apiMessages, locale);

  const user = await getCurrentUser();
  if (!user || user.role !== "STUDENT") {
    return NextResponse.json({ error: t("unauthorized") }, { status: 401 });
  }

  const { id } = await params;
  const { rating, feedback } = await req.json();
  const numericRating = Number(rating);
  if (!numericRating || numericRating < 1 || numericRating > 5) {
    return NextResponse.json({ error: t("invalidRating") }, { status: 400 });
  }

  const session = await prisma.session.findUnique({ where: { id } });
  if (!session || session.studentId !== user.id) {
    return NextResponse.json({ error: t("notFound") }, { status: 404 });
  }
  if (session.status !== "COMPLETED") {
    return NextResponse.json({ error: t("sessionNotCompletedYet") }, { status: 400 });
  }
  if (session.studentRating) {
    return NextResponse.json({ error: t("alreadyRatedTeacher") }, { status: 400 });
  }

  await prisma.session.update({
    where: { id },
    data: { studentRating: numericRating, studentFeedback: feedback || "" },
  });

  const result = await rewardTeacherForStudentRating(session.teacherId, numericRating);

  return NextResponse.json({ ok: true, teacher: result });
}
