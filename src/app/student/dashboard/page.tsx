import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function formatDateTime(d: Date) {
  return new Intl.DateTimeFormat("ar-SA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

export default async function StudentDashboard() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [upcoming, past, progress, badges] = await Promise.all([
    prisma.session.findMany({
      where: { studentId: user.id, status: "SCHEDULED" },
      orderBy: { startAt: "asc" },
      include: { teacher: true },
    }),
    prisma.session.findMany({
      where: { studentId: user.id, status: "COMPLETED" },
      orderBy: { startAt: "desc" },
      include: { teacher: true },
      take: 5,
    }),
    prisma.progress.findMany({ where: { studentId: user.id } }),
    prisma.badge.findMany({ where: { studentId: user.id }, orderBy: { earnedAt: "desc" } }),
  ]);

  const nextSession = upcoming[0];
  const completedCount = await prisma.session.count({
    where: { studentId: user.id, status: "COMPLETED" },
  });

  return (
    <div className="space-y-10">
      <div className="animate-fade-up">
        <h1 className="text-2xl font-extrabold text-night">
          أهلًا بك، {user.name} 👋
        </h1>
        <p className="text-muted mt-1">إليك ملخص رحلتك التعليمية اليوم.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon="⭐" label="النقاط" value={user.points} delay={1} />
        <StatCard icon="🔥" label="المتتالية" value={user.streak} suffix=" يوم" delay={2} />
        <StatCard icon="✅" label="حصص مكتملة" value={completedCount} delay={3} />
        <StatCard icon="🏅" label="الشارات" value={badges.length} delay={4} />
      </div>

      {/* Next session */}
      <section className="relative overflow-hidden animate-fade-up stagger-3 bg-fajr-night text-white rounded-3xl p-7">
        <div className="absolute inset-0 bg-dot-grid opacity-30" />
        <div className="fajr-orb w-56 h-56 bg-gold/25 -top-16 -right-10" />
        {nextSession ? (
          <div className="relative flex flex-wrap items-center justify-between gap-5">
            <div>
              <span className="text-gold-light text-xs font-bold">حصتك القادمة</span>
              <h2 className="text-xl font-extrabold mt-1">
                مع {nextSession.teacher.name} {nextSession.teacher.avatarEmoji}
              </h2>
              <p className="text-gray-300 text-sm mt-1">
                {formatDateTime(nextSession.startAt)}
                {nextSession.surahFocus && ` • محور الحصة: ${nextSession.surahFocus}`}
              </p>
            </div>
            <Link
              href={`/session/${nextSession.id}`}
              className="bg-gradient-to-l from-dawn to-gold text-white font-bold px-6 py-3 rounded-full hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-400/30 transition-all animate-pulse-ring"
            >
              🎥 ادخل الحصة
            </Link>
          </div>
        ) : (
          <div className="relative flex flex-wrap items-center justify-between gap-5">
            <div>
              <h2 className="text-xl font-extrabold">لا توجد حصص قادمة بعد</h2>
              <p className="text-gray-300 text-sm mt-1">احجز حصتك الأولى الآن وابدأ رحلتك!</p>
            </div>
            <Link
              href="/student/book"
              className="bg-gradient-to-l from-dawn to-gold text-white font-bold px-6 py-3 rounded-full hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-400/30 transition-all"
            >
              احجز حصة الآن
            </Link>
          </div>
        )}
      </section>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Progress */}
        <section className="hover-lift animate-fade-up bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-extrabold text-night mb-4">تقدمي في الحفظ والمراجعة</h3>
          {progress.length === 0 ? (
            <p className="text-sm text-muted">سيظهر تقدمك هنا بعد أول حصة مع معلمك.</p>
          ) : (
            <ul className="space-y-4">
              {progress.map((p) => {
                const pct = p.status === "مكتمل" ? 100 : p.status === "مراجعة" ? 66 : 33;
                const barColor =
                  p.status === "مكتمل" ? "bg-green-500" : p.status === "مراجعة" ? "bg-blue-500" : "bg-dawn";
                return (
                  <li key={p.id} className="text-sm">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-semibold text-ink">{p.surah}</span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          p.status === "مكتمل"
                            ? "bg-green-100 text-green-700"
                            : p.status === "مراجعة"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${barColor} transition-all duration-700`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Badges */}
        <section className="hover-lift animate-fade-up stagger-1 bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-extrabold text-night mb-4">شاراتي</h3>
          {badges.length === 0 ? (
            <p className="text-sm text-muted">أكمل حصتك الأولى لتحصل على أول شارة 🌱</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {badges.map((b, i) => (
                <div
                  key={b.id}
                  className={`animate-scale-in stagger-${Math.min(i + 1, 6)} flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-xl px-4 py-2 transition-transform hover:scale-105`}
                  title={b.label}
                >
                  <span className="text-xl">{b.icon}</span>
                  <span className="text-sm font-bold text-night">{b.label}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* History */}
      <section className="hover-lift animate-fade-up bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-extrabold text-night mb-4">سجل الحصص السابقة</h3>
        {past.length === 0 ? (
          <p className="text-sm text-muted">لا توجد حصص سابقة بعد.</p>
        ) : (
          <ul className="divide-y">
            {past.map((s) => (
              <li key={s.id} className="py-3 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="font-semibold text-sm">
                    {s.teacher.avatarEmoji} {s.teacher.name}
                  </p>
                  <p className="text-xs text-muted">{formatDateTime(s.startAt)}</p>
                  {s.teacherNotes && (
                    <p className="text-xs text-muted mt-1">ملاحظة المعلم: {s.teacherNotes}</p>
                  )}
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
  suffix = "",
  delay = 0,
}: {
  icon: string;
  label: string;
  value: number;
  suffix?: string;
  delay?: number;
}) {
  return (
    <div
      className={`hover-lift animate-fade-up stagger-${delay} bg-white rounded-2xl border border-gray-100 p-5 text-center`}
    >
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-xl font-extrabold text-night">
        {value}
        {suffix}
      </div>
      <div className="text-xs text-muted mt-1">{label}</div>
    </div>
  );
}
