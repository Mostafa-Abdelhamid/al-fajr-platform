import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const { id } = await params;
  const profile = await prisma.teacherProfile.findUnique({ where: { id } });
  if (!profile) {
    return NextResponse.json({ error: "غير موجود" }, { status: 404 });
  }

  const updated = await prisma.teacherProfile.update({
    where: { id },
    data: { isVerified: !profile.isVerified },
  });

  return NextResponse.json({ ok: true, isVerified: updated.isVerified });
}
