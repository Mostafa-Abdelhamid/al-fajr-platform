import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getLocale } from "@/i18n/getLocale";
import { makeT } from "@/i18n/t";
import { apiMessages } from "@/i18n/dictionaries/apiMessages";

export async function POST(req: NextRequest) {
  const locale = await getLocale();
  const t = makeT(apiMessages, locale);

  const admin = await getCurrentUser();
  if (!admin || admin.role !== "ADMIN") {
    return NextResponse.json({ error: t("unauthorized") }, { status: 401 });
  }

  const { reciter, riwaya } = (await req.json()) as { reciter?: string; riwaya?: string };
  const trimmedReciter = reciter?.trim();
  const trimmedRiwaya = riwaya?.trim();

  if (!trimmedReciter || !trimmedRiwaya) {
    return NextResponse.json({ error: t("fillReciterAndRiwaya") }, { status: 400 });
  }

  const existing = await prisma.qiraatOption.findUnique({ where: { riwaya: trimmedRiwaya } });
  if (existing) {
    return NextResponse.json({ error: t("riwayaAlreadyAdded") }, { status: 400 });
  }

  const maxOrder = await prisma.qiraatOption.aggregate({ _max: { sortOrder: true } });

  const created = await prisma.qiraatOption.create({
    data: {
      reciter: trimmedReciter,
      riwaya: trimmedRiwaya,
      sortOrder: (maxOrder._max.sortOrder ?? 0) + 1,
    },
  });

  return NextResponse.json({ ok: true, option: created });
}
