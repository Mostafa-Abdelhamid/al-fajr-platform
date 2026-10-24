import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ProgressForm from "@/components/ProgressForm";

function formatDateTime(d: Date) {
  return new Intl.DateTimeFormat("ar-SA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

export default async function TeacherDashboard() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [upcoming, completed, profile] = await Promise.all([
    prisma.session.findMany({
      where: { teacherId: user.id, status: "SCHEDULED" },
      orderBy: { startAt: "asc" },
      include: { student: true },
    }),
    prisma.session.findMany({
      where: { teacherId: user.id, status: "COMPLETED" },
      orderBy: { startAt: "desc" },
      include: { student: true },
      take: 8,
    }),
    prisma.teacherProfile.findUnique({ where: { userId: user.id } }),
  ]);

  const studentMap = new Map<string, { id: string; name: string; avatarEmoji: string }>();
  [...upcoming, ...completed].forEach((s) => {
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
            <h1 className="text-2xl font-extrabold">أهلًا بك، {user.name}</h1>
            <p className="text-gray-300 mt-1 text-sm">إليك نظرة سريعة على جدولك وطلابك.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon="📅" label="حصص قادمة" value={upcoming.length} delay={1} />
        <StatCard icon="✅" label="حصص مكتملة" value={completed.length} delay={2} />
        <StatCard icon="🧑‍🎓" label="عدد الطلاب" value={students.length} delay={3} />
        <StatCard icon="⭐" label="التقييم" value={profile ? Number(profile.rating.toFixed(1)) : 5} delay={4} />
      </div>

      <section className="hover-lift animate-fade-up stagger-3 bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-extrabold text-night">حصصك القادمة</h3>
          <Link href="/teacher/availability" className="text-sm text-dawn font-bold">
            إدارة أوقات التواجد
          </Link>
        </div>
        {upcoming.length === 0 ? (
          <p className="text-sm text-muted">لا توجد حصص قادمة حاليًا.</p>
        ) : (
          <ul className="divide-y">
            {upcoming.map((s) => (
              <li key={s.id} className="py-3 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="font-semibold text-sm">
                    {s.student.avatarEmoji} {s.student.name}
                  </p>
                  <p className="text-xs text-muted">
                    {formatDateTime(s.startAt)}
                    {s.surahFocus && ` • ${s.surahFocus}`}
                  </p>
                </div>
                <Link
                  href={`/session/${s.id}`}
                  className="bg-gradient-to-l from-dawn to-gold text-white font-bold text-sm px-5 py-2 rounded-full hover:-translate-y-0.5 hover:shadow-lg transition-all"
                >
                  🎥 ادخل الحصة
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="hover-lift animate-fade-up bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-extrabold text-night mb-4">طلابي ومتابعة تقدمهم</h3>
        {students.length === 0 ? (
          <p className="text-sm text-muted">سيظهر هنا طلابك بعد أول حصة محجوزة.</p>
        ) : (
          <ul className="divide-y">
            {students.map((st) => (
              <li key={st.id} className="py-4">
                <p className="font-semibold text-sm">
                  {st.avatarEmoji} {st.name}
                </p>
                <ProgressForm studentId={st.id} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="hover-lift animate-fade-up bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-extrabold text-night mb-4">آخر الحصص المكتملة</h3>
        {completed.length === 0 ? (
          <p className="text-sm text-muted">لا توجد حصص مكتملة بعد.</p>
        ) : (
          <ul className="divide-y">
            {completed.map((s) => (
              <li key={s.id} className="py-3 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="font-semibold text-sm">
                    {s.student.avatarEmoji} {s.student.name}
                  </p>
                  <p className="text-xs text-muted">{formatDateTime(s.startAt)}</p>
                </div>
                {s.rating && (
                  <span className="text-gold font-bold text-sm">
                    {"★".repeat(s.rating)}{"☆".repeat(5 - s.rating)}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  delay = 0,
}: {
  icon: string;
  label: string;
  value: number;
  delay?: number;
}) {
  return (
    <div className={`hover-lift animate-fade-up stagger-${delay} bg-white rounded-2xl border border-gray-100 p-5 text-center`}>
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-xl font-extrabold text-night">{value}</div>
      <div className="text-xs text-muted mt-1">{label}</div>
    </div>
  );
}
