import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getLocale } from "@/i18n/getLocale";
import { makeT } from "@/i18n/t";
import { apiMessages } from "@/i18n/dictionaries/apiMessages";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const locale = await getLocale();
  const t = makeT(apiMessages, locale);

  const user = await getCurrentUser();
  if (!user || user.role !== "TEACHER") {
    return NextResponse.json({ error: t("unauthorized") }, { status: 401 });
  }

  const { id } = await params;
  const slot = await prisma.availability.findUnique({ where: { id }, include: { teacher: true } });
  if (!slot || slot.teacher.userId !== user.id) {
    return NextResponse.json({ error: t("notFound") }, { status: 404 });
  }

  await prisma.availability.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
