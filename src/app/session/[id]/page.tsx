import { redirect, notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SessionRoom from "@/components/SessionRoom";

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

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-night text-white px-5 py-3 flex items-center justify-between">
        <span className="font-extrabold">🌅 منصة الفجر — غرفة الحصة</span>
      </div>
      <SessionRoom
        session={{
          id: session.id,
          roomName: session.roomName,
          status: session.status,
          surahFocus: session.surahFocus,
          teacherNotes: session.teacherNotes,
          rating: session.rating,
          otherPartyName: otherParty.name,
          otherPartyEmoji: otherParty.avatarEmoji,
        }}
        isTeacher={isTeacher}
        dashboardHref={isTeacher ? "/teacher/dashboard" : "/student/dashboard"}
      />
    </div>
  );
}
