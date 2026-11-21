import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail, sessionReminderEmailHtml } from "@/lib/email";

// Called every few minutes by an external scheduler (see
// .github/workflows/session-reminders.yml) to email both sides of a
// session shortly before it starts. Protected by a shared secret since it
// has no user session of its own — anyone calling it without the right
// secret gets nothing back.
//
// Window: sessions starting 25-35 minutes from now that haven't already
// had a reminder sent. The 10-minute window is wider than the ~10-minute
// check interval so a slow/late cron run can't skip a session entirely;
// `reminderSent` stops it from being emailed twice if two runs overlap it.
const REMINDER_WINDOW_START_MIN = 25;
const REMINDER_WINDOW_END_MIN = 35;

export async function GET(req: NextRequest) {
  const expected = process.env.CRON_SECRET;
  const provided = req.headers.get("x-cron-secret") || new URL(req.url).searchParams.get("secret");

  if (!expected || provided !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const now = Date.now();
  const windowStart = new Date(now + REMINDER_WINDOW_START_MIN * 60 * 1000);
  const windowEnd = new Date(now + REMINDER_WINDOW_END_MIN * 60 * 1000);

  const sessions = await prisma.session.findMany({
    where: {
      status: "SCHEDULED",
      reminderSent: false,
      startAt: { gte: windowStart, lte: windowEnd },
    },
    include: { student: true, teacher: true },
  });

  const appUrl = (process.env.APP_URL || "http://localhost:3000").replace(/\/$/, "");
  let sent = 0;

  for (const s of sessions) {
    const sessionUrl = `${appUrl}/session/${s.id}`;

    const [studentResult, teacherResult] = await Promise.all([
      sendEmail(
        s.student.email,
        "تذكير: حصتك تبدأ بعد 30 دقيقة — منصة الفجر",
        sessionReminderEmailHtml({
          recipientName: s.student.name,
          otherPartyName: s.teacher.name,
          startAt: s.startAt,
          surahFocus: s.surahFocus,
          sessionUrl,
        })
      ),
      sendEmail(
        s.teacher.email,
        "تذكير: حصتك تبدأ بعد 30 دقيقة — منصة الفجر",
        sessionReminderEmailHtml({
          recipientName: s.teacher.name,
          otherPartyName: s.student.name,
          startAt: s.startAt,
          surahFocus: s.surahFocus,
          sessionUrl,
        })
      ),
    ]);

    if (!studentResult.ok || !teacherResult.ok) {
      console.error(`Reminder email failed for session ${s.id}`);
    }

    await prisma.session.update({ where: { id: s.id }, data: { reminderSent: true } });
    sent += 1;
  }

  return NextResponse.json({ ok: true, remindersSent: sent });
}
