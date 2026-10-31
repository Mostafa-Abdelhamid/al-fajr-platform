import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getLocale } from "@/i18n/getLocale";
import { makeT } from "@/i18n/t";
import { apiMessages } from "@/i18n/dictionaries/apiMessages";

export async function POST(req: NextRequest) {
  const locale = await getLocale();
  const t = makeT(apiMessages, locale);

  const user = await getCurrentUser();
  if (!user || user.role !== "TEACHER") {
    return NextResponse.json({ error: t("unauthorized") }, { status: 401 });
  }

  const { dayOfWeek, startTime, endTime } = await req.json();
  if (dayOfWeek === undefined || !startTime || !endTime) {
    return NextResponse.json({ error: t("missingData") }, { status: 400 });
  }
  if (startTime >= endTime) {
    return NextResponse.json({ error: t("startBeforeEnd") }, { status: 400 });
  }

  const profile = await prisma.teacherProfile.findUnique({ where: { userId: user.id } });
  if (!profile) {
    return NextResponse.json({ error: t("profileNotFound") }, { status: 404 });
  }

  const availability = await prisma.availability.create({
    data: { teacherId: profile.id, dayOfWeek, startTime, endTime },
  });

  return NextResponse.json({ ok: true, availability });
}
