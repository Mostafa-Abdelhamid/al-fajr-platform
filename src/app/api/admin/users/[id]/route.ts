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

  if (id === admin.id) {
    return NextResponse.json({ error: t("cannotDeleteOwnAccount") }, { status: 400 });
  }

  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) {
    return NextResponse.json({ error: t("userNotFound") }, { status: 404 });
  }
  if (target.role === "ADMIN") {
    return NextResponse.json({ error: t("cannotDeleteOtherAdmin") }, { status: 400 });
  }

  await prisma.user.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
