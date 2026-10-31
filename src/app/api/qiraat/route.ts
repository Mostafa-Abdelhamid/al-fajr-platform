import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const options = await prisma.qiraatOption.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  const groups: { reciter: string; riwayat: { id: string; riwaya: string }[] }[] = [];
  for (const o of options) {
    let group = groups.find((g) => g.reciter === o.reciter);
    if (!group) {
      group = { reciter: o.reciter, riwayat: [] };
      groups.push(group);
    }
    group.riwayat.push({ id: o.id, riwaya: o.riwaya });
  }

  return NextResponse.json({ groups });
}
