import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "ADMIN") {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const { reciter, riwaya } = (await req.json()) as { reciter?: string; riwaya?: string };
  const trimmedReciter = reciter?.trim();
  const trimmedRiwaya = riwaya?.trim();

  if (!trimmedReciter || !trimmedRiwaya) {
    return NextResponse.json({ error: "الرجاء تعبئة اسم القارئ والرواية" }, { status: 400 });
  }

  const existing = await prisma.qiraatOption.findUnique({ where: { riwaya: trimmedRiwaya } });
  if (existing) {
    return NextResponse.json({ error: "هذه الرواية مضافة مسبقًا" }, { status: 400 });
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
