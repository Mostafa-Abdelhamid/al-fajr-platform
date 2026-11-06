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

  const { studentId, title, note } = (await req.json()) as {
    studentId?: string;
    title?: string;
    note?: string;
  };

  if (!studentId || !title?.trim()) {
    return NextResponse.json({ error: t("missingData") }, { status: 400 });
  }

  const hasSession = await prisma.session.findFirst({
    where: { studentId, teacherId: user.id },
  });
  if (!hasSession) {
    return NextResponse.json({ error: t("noLinkToStudent") }, { status: 403 });
  }

  const certificate = await prisma.certificate.create({
    data: {
      studentId,
      type: "MANUAL",
      title: title.trim(),
      note: note?.trim() || "",
      issuedByTeacherId: user.id,
    },
  });

  return NextResponse.json({ ok: true, certificate });
}
