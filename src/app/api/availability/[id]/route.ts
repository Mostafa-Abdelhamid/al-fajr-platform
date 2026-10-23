import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "TEACHER") {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const { id } = await params;
  const slot = await prisma.availability.findUnique({ where: { id }, include: { teacher: true } });
  if (!slot || slot.teacher.userId !== user.id) {
    return NextResponse.json({ error: "غير موجود" }, { status: 404 });
  }

  await prisma.availability.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
