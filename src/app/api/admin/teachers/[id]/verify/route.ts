import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getLocale } from "@/i18n/getLocale";
import { makeT } from "@/i18n/t";
import { apiMessages } from "@/i18n/dictionaries/apiMessages";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const locale = await getLocale();
  const t = makeT(apiMessages, locale);

  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: t("unauthorized") }, { status: 401 });
  }

  const { id } = await params;
  const profile = await prisma.teacherProfile.findUnique({ where: { id } });
  if (!profile) {
    return NextResponse.json({ error: t("notFound") }, { status: 404 });
  }

  const updated = await prisma.teacherProfile.update({
    where: { id },
    data: { isVerified: !profile.isVerified },
  });

  return NextResponse.json({ ok: true, isVerified: updated.isVerified });
}
