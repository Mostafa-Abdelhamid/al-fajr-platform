import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createVideoRoom } from "@/lib/daily";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "STUDENT") {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const { teacherId, startAt, surahFocus } = await req.json();
  if (!teacherId || !startAt) {
    return NextResponse.json({ error: "بيانات ناقصة" }, { status: 400 });
  }

  const start = new Date(startAt);
  const end = new Date(start.getTime() + 60 * 60 * 1000);

  const clash = await prisma.session.findFirst({
    where: { teacherId, startAt: start, status: "SCHEDULED" },
  });
  if (clash) {
    return NextResponse.json({ error: "هذا الموعد لم يعد متاحًا، اختر موعدًا آخر" }, { status: 409 });
  }

  const baseId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const roomName = await createVideoRoom(baseId, end);

  try {
    const session = await prisma.session.create({
      data: {
        studentId: user.id,
        teacherId,
        startAt: start,
        endAt: end,
        roomName,
        surahFocus: surahFocus || "",
      },
    });
    return NextResponse.json({ ok: true, sessionId: session.id });
  } catch (err: unknown) {
    // Guards against two students booking the same slot at the same instant
    // (the findFirst check above has a race window); a DB-level unique index
    // on (teacherId, startAt) for SCHEDULED sessions catches what slips through.
    if (typeof err === "object" && err !== null && "code" in err && err.code === "P2002") {
      return NextResponse.json({ error: "هذا الموعد لم يعد متاحًا، اختر موعدًا آخر" }, { status: 409 });
    }
    throw err;
  }
}
