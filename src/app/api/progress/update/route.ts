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

  const { studentId, surah, status } = await req.json();
  if (!studentId || !surah || !status) {
    return NextResponse.json({ error: t("missingData") }, { status: 400 });
  }

  const taught = await prisma.session.findFirst({
    where: { teacherId: user.id, studentId },
  });
  if (!taught) {
    return NextResponse.json({ error: t("noLinkToStudent") }, { status: 403 });
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
