import { prisma } from "@/lib/prisma";
import TeacherStudentLeaderboardList from "./TeacherStudentLeaderboardList";

export default async function TeacherStudentLeaderboard({ teacherId }: { teacherId: string }) {
  const linkedSessions = await prisma.session.findMany({
    where: { teacherId },
    select: { studentId: true },
    distinct: ["studentId"],
  });
  const studentIds = linkedSessions.map((s) => s.studentId);

  const students = studentIds.length
    ? await prisma.user.findMany({
        where: { id: { in: studentIds }, role: "STUDENT" },
        orderBy: { points: "desc" },
        select: { id: true, name: true, avatarEmoji: true, points: true, streak: true },
      })
    : [];

  return <TeacherStudentLeaderboardList students={students} />;
}
