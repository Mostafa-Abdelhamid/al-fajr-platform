import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildTeacherScheduleWorkbook } from "@/lib/excel";
import { getLocale } from "@/i18n/getLocale";
import { makeT } from "@/i18n/t";
import { apiMessages } from "@/i18n/dictionaries/apiMessages";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const locale = await getLocale();
  const t = makeT(apiMessages, locale);

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: t("unauthorized") }, { status: 401 });
  }

  const { id } = await params;
  const isSelf = user.role === "TEACHER" && user.id === id;
  if (!isSelf && user.role !== "ADMIN") {
    return NextResponse.json({ error: t("unauthorized") }, { status: 401 });
  }

  const profile = await prisma.teacherProfile.findUnique({ where: { userId: id } });
  if (!profile) {
    return NextResponse.json({ error: t("profileNotFound") }, { status: 404 });
  }

  const buffer = await buildTeacherScheduleWorkbook(id, locale);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="schedule-${id}.xlsx"`,
    },
  });
}
