import { prisma } from "@/lib/prisma";
import VerifyToggle from "@/components/VerifyToggle";
import DeleteUserButton from "@/components/DeleteUserButton";

function formatDateTime(d: Date) {
  return new Intl.DateTimeFormat("ar-SA", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

export default async function AdminDashboard() {
  const [studentCount, teacherCount, scheduledCount, completedCount, pointsAgg, teachers, students, recentSessions] =
    await Promise.all([
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.user.count({ where: { role: "TEACHER" } }),
      prisma.session.count({ where: { status: "SCHEDULED" } }),
      prisma.session.count({ where: { status: "COMPLETED" } }),
      prisma.user.aggregate({ where: { role: "STUDENT" }, _sum: { points: true } }),
      prisma.teacherProfile.findMany({ include: { user: true, availability: true } }),
      prisma.user.findMany({
        where: { role: "STUDENT" },
        orderBy: { createdAt: "desc" },
      }),
      prisma.session.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { student: true, teacher: true },
      }),
    ]);

  const avgRating =
    teachers.length > 0
      ? (teachers.reduce((sum, t) => sum + t.rating, 0) / teachers.length).toFixed(1)
      : "—";

  return (
    <div className="space-y-10">
      <div className="relative overflow-hidden bg-fajr-night text-white rounded-3xl p-7 animate-fade-up">
        <div className="absolute inset-0 bg-dot-grid opacity-30" />
        <div className="fajr-orb w-64 h-64 bg-gold/25 -top-20 -left-10" />
        <div className="relative flex items-center gap-3">
          <span className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl">🛡️</span>
          <div>
            <h1 className="text-2xl font-extrabold">لوحة إدارة منصة الفجر</h1>
            <p className="text-gray-300 mt-1 text-sm">نظرة شاملة على نشاط المنصة والمستخدمين.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard icon="🧑‍🎓" label="الطلاب" value={studentCount} color="bg-blue-50" delay={1} />
        <StatCard icon="👨‍🏫" label="المعلمون" value={teacherCount} color="bg-orange-50" delay={2} />
        <StatCard icon="📅" label="حصص قادمة" value={scheduledCount} color="bg-purple-50" delay={3} />
        <StatCard icon="✅" label="حصص مكتملة" value={completedCount} color="bg-green-50" delay={4} />
        <StatCard icon="⭐" label="متوسط التقييم" value={avgRating} color="bg-yellow-50" delay={5} />
        <StatCard icon="🏅" label="إجمالي نقاط الطلاب" value={pointsAgg._sum.points ?? 0} color="bg-red-50" delay={6} />
      </div>

      <section className="hover-lift animate-fade-up bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-lg">✅</span>
          <h3 className="font-extrabold text-night">إدارة المعلمين والتوثيق</h3>
          <span className="text-xs font-bold text-muted bg-gray-100 rounded-full px-2.5 py-1">{teachers.length}</span>
        </div>
        {teachers.length === 0 ? (
          <p className="text-sm text-muted">لا يوجد معلمون مسجلون بعد.</p>
        ) : (
          <ul className="divide-y max-h-[480px] overflow-y-auto">
            {teachers.map((t) => (
              <li
                key={t.id}
                className="py-3 px-2 -mx-2 rounded-xl flex items-center justify-between flex-wrap gap-3 hover:bg-orange-50/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-lg shrink-0">
                    {t.user.avatarEmoji}
                  </span>
                  <div>
                    <p className="font-semibold text-sm">
                      {t.user.name}{" "}
                      <span className="text-xs text-muted font-normal">({t.user.email})</span>
                    </p>
                    <p className="text-xs text-muted mt-0.5">
                      {t.qiraat} • ⭐ {t.rating.toFixed(1)} ({t.ratingCount} تقييم) • {t.availability.length} أوقات تواجد مُعرّفة
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <VerifyToggle teacherProfileId={t.id} initialVerified={t.isVerified} />
                  <DeleteUserButton userId={t.user.id} userName={t.user.name} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="hover-lift animate-fade-up stagger-1 bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-lg">🧑‍🎓</span>
          <h3 className="font-extrabold text-night">إدارة الطلاب</h3>
          <span className="text-xs font-bold text-muted bg-gray-100 rounded-full px-2.5 py-1">{students.length}</span>
        </div>
        {students.length === 0 ? (
          <p className="text-sm text-muted">لا يوجد طلاب مسجلون بعد.</p>
        ) : (
          <ul className="divide-y max-h-[480px] overflow-y-auto">
            {students.map((s) => (
              <li
                key={s.id}
                className="py-3 px-2 -mx-2 rounded-xl flex items-center justify-between flex-wrap gap-3 hover:bg-blue-50/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg shrink-0">
                    {s.avatarEmoji}
                  </span>
                  <div>
                    <p className="font-semibold text-sm">
                      {s.name} <span className="text-xs text-muted font-normal">({s.email})</span>
                    </p>
                    <p className="text-xs text-muted mt-0.5">
                      ⭐ {s.points} نقطة • 🔥 {s.streak} متتالية
                    </p>
                  </div>
                </div>
                <DeleteUserButton userId={s.id} userName={s.name} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="hover-lift animate-fade-up bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-lg">📋</span>
          <h3 className="font-extrabold text-night">آخر الحصص على المنصة</h3>
        </div>
        {recentSessions.length === 0 ? (
          <p className="text-sm text-muted">لا توجد حصص بعد.</p>
        ) : (
          <ul className="divide-y">
            {recentSessions.map((s) => (
              <li
                key={s.id}
                className="py-3 px-2 -mx-2 rounded-xl flex items-center justify-between flex-wrap gap-2 text-sm hover:bg-gray-50 transition-colors"
              >
                <span>
                  {s.student.avatarEmoji} {s.student.name} ← {s.teacher.avatarEmoji} {s.teacher.name}
                </span>
                <span className="text-xs text-muted">{formatDateTime(s.startAt)}</span>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    s.status === "COMPLETED"
                      ? "bg-green-100 text-green-700"
                      : s.status === "SCHEDULED"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {s.status === "COMPLETED" ? "مكتملة" : s.status === "SCHEDULED" ? "قادمة" : "ملغاة"}
                </span>
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
  color = "bg-gray-50",
  delay = 0,
}: {
  icon: string;
  label: string;
  value: number | string;
  color?: string;
  delay?: number;
}) {
  return (
    <div className={`hover-lift animate-fade-up stagger-${delay} bg-white rounded-2xl border border-gray-100 p-5 text-center`}>
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center text-xl mx-auto mb-2`}>
        {icon}
      </div>
      <div className="text-xl font-extrabold text-night">{value}</div>
      <div className="text-xs text-muted mt-1">{label}</div>
    </div>
  );
}
