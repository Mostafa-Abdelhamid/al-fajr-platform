import { redirect, notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getLocale } from "@/i18n/getLocale";
import { makeT } from "@/i18n/t";
import { session as sessionDict } from "@/i18n/dictionaries/session";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import SessionRoom from "@/components/SessionRoom";
import { createMeetingToken } from "@/lib/daily";

export default async function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const session = await prisma.session.findUnique({
    where: { id },
    include: { student: true, teacher: true },
  });

  if (!session) notFound();
  if (session.studentId !== user.id && session.teacherId !== user.id) {
    redirect(user.role === "TEACHER" ? "/teacher/dashboard" : "/student/dashboard");
  }

  const isTeacher = user.role === "TEACHER";
  const otherParty = isTeacher ? session.student : session.teacher;

  const locale = await getLocale();
  const t = makeT(sessionDict, locale);

  // The teacher joins as the Daily "owner", which unlocks Daily Prebuilt's
  // native per-participant mute control in its own participant list.
  const videoToken = await createMeetingToken(session.roomName, user.name, isTeacher);

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-night text-white px-5 py-3 flex items-center justify-between gap-3">
        <span className="font-extrabold text-sm sm:text-base whitespace-nowrap overflow-hidden text-ellipsis">
          {t("roomHeader")}
        </span>
        <LocaleSwitcher className="shrink-0" />
      </div>
      <SessionRoom
        session={{
          id: session.id,
          roomName: session.roomName,
          status: session.status,
          surahFocus: session.surahFocus,
          teacherNotes: session.teacherNotes,
          rating: session.rating,
          studentRating: session.studentRating,
          otherPartyName: otherParty.name,
          otherPartyEmoji: otherParty.avatarEmoji,
        }}
        isTeacher={isTeacher}
        dashboardHref={isTeacher ? "/teacher/dashboard" : "/student/dashboard"}
        videoToken={videoToken}
      />
    </div>
  );
}
