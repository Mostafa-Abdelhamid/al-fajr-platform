import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "ADMIN") {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.qiraatOption.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "هذه الرواية غير موجودة" }, { status: 404 });
  }

  await prisma.qiraatOption.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
