import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getLocale } from "@/i18n/getLocale";
import { makeT } from "@/i18n/t";
import { apiMessages } from "@/i18n/dictionaries/apiMessages";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const locale = await getLocale();
  const t = makeT(apiMessages, locale);

  const admin = await getCurrentUser();
  if (!admin || admin.role !== "ADMIN") {
    return NextResponse.json({ error: t("unauthorized") }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.qiraatOption.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: t("riwayaNotFound") }, { status: 404 });
  }

  await prisma.qiraatOption.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
