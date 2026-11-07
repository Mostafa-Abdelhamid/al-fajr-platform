import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getLocale } from "@/i18n/getLocale";
import { makeT } from "@/i18n/t";
import { teacher as teacherDict } from "@/i18n/dictionaries/teacher";
import TeacherStudentLeaderboard from "@/components/TeacherStudentLeaderboard";
import DownloadScheduleButton from "@/components/DownloadScheduleButton";
import AnimatedNumber from "@/components/AnimatedNumber";
import TeacherSessionsList from "@/components/TeacherSessionsList";
import TeacherStudentsList from "@/components/TeacherStudentsList";
import TeacherCertificatesList from "@/components/TeacherCertificatesList";

export default async function TeacherDashboard() {
  const user = await getCurrentUser();
  if (!user) return null;

  const locale = await getLocale();
  const t = makeT(teacherDict, locale);

  const [upcoming, missed, completed, profile, issuedCertificates] = await Promise.all([
    prisma.session.findMany({
      where: { teacherId: user.id, status: "SCHEDULED", startAt: { gte: new Date() } },
      orderBy: { startAt: "asc" },
      include: { student: true },
    }),
    prisma.session.findMany({
      where: { teacherId: user.id, status: "SCHEDULED", startAt: { lt: new Date() } },
      orderBy: { startAt: "desc" },
      include: { student: true },
    }),
    prisma.session.findMany({
      where: { teacherId: user.id, status: "COMPLETED" },
      orderBy: { startAt: "desc" },
      include: { student: true },
    }),
    prisma.teacherProfile.findUnique({ where: { userId: user.id } }),
    prisma.certificate.findMany({
      where: { issuedByTeacherId: user.id },
      include: { student: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const studentMap = new Map<string, { id: string; name: string; avatarEmoji: string }>();
  [...upcoming, ...missed, ...completed].forEach((s) => {
    studentMap.set(s.studentId, {
      id: s.student.id,
      name: s.student.name,
      avatarEmoji: s.student.avatarEmoji,
    });
  });
  const students = Array.from(studentMap.values());

  return (
    <div className="space-y-10">
      <div className="relative overflow-hidden bg-fajr-night text-white rounded-3xl p-7 animate-fade-up">
        <div className="absolute inset-0 bg-dot-grid opacity-30" />
        <div className="fajr-orb w-64 h-64 bg-gold/25 -top-20 -left-10" />
        <div className="relative flex items-center gap-3">
          <span className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl">👨‍🏫</span>
          <div>
            <h1 className="text-2xl font-extrabold">{t("greeting")}{user.name}</h1>
            <p className="text-gray-300 mt-1 text-sm">{t("dashboardSubtitle")}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <StatCard icon="📅" label={t("statUpcoming")} value={upcoming.length} delay={1} />
        <StatCard icon="✅" label={t("statCompleted")} value={completed.length} delay={2} />
        <StatCard icon="🧑‍🎓" label={t("statStudentCount")} value={students.length} delay={3} />
        <StatCard
          icon="⭐"
          label={t("statRating")}
          value={profile ? Number(profile.rating.toFixed(1)) : 5}
          decimals={1}
          delay={4}
        />
        <StatCard icon="🏆" label={t("statPoints")} value={profile?.points ?? 0} delay={5} />
      </div>

      <div className="flex justify-end">
        <DownloadScheduleButton teacherId={user.id} />
      </div>

      <TeacherStudentLeaderboard teacherId={user.id} />

      <TeacherSessionsList sessions={upcoming} variant="upcoming" />

      <TeacherSessionsList sessions={missed} variant="missed" />

      <TeacherStudentsList students={students} />

      <TeacherCertificatesList certificates={issuedCertificates} />

      <TeacherSessionsList sessions={completed} variant="completed" />
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  decimals = 0,
  delay = 0,
}: {
  icon: string;
  label: string;
  value: number;
  decimals?: number;
  delay?: number;
}) {
  return (
    <div className={`hover-lift animate-fade-up stagger-${delay} bg-white rounded-2xl border border-gray-100 p-5 text-center`}>
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-xl font-extrabold text-night">
        <AnimatedNumber value={value} decimals={decimals} />
      </div>
      <div className="text-xs text-muted mt-1">{label}</div>
    </div>
  );
}
