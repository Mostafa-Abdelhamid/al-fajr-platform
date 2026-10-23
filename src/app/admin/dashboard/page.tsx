import { prisma } from "@/lib/prisma";
import VerifyToggle from "@/components/VerifyToggle";

function formatDateTime(d: Date) {
  return new Intl.DateTimeFormat("ar-SA", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

export default async function AdminDashboard() {
  const [studentCount, teacherCount, scheduledCount, completedCount, pointsAgg, teachers, recentSessions] =
    await Promise.all([
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.user.count({ where: { role: "TEACHER" } }),
      prisma.session.count({ where: { status: "SCHEDULED" } }),
      prisma.session.count({ where: { status: "COMPLETED" } }),
      prisma.user.aggregate({ where: { role: "STUDENT" }, _sum: { points: true } }),
      prisma.teacherProfile.findMany({ include: { user: true, availability: true } }),
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
      <div>
        <h1 className="text-2xl font-extrabold text-night">لوحة إدارة منصة الفجر 🛡️</h1>
        <p className="text-muted mt-1">نظرة شاملة على نشاط المنصة والمستخدمين.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard icon="🧑‍🎓" label="الطلاب" value={studentCount} />
        <StatCard icon="👨‍🏫" label="المعلمون" value={teacherCount} />
        <StatCard icon="📅" label="حصص قادمة" value={scheduledCount} />
        <StatCard icon="✅" label="حصص مكتملة" value={completedCount} />
        <StatCard icon="⭐" label="متوسط التقييم" value={avgRating} />
        <StatCard icon="🏅" label="إجمالي نقاط الطلاب" value={pointsAgg._sum.points ?? 0} />
      </div>

      <section className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-extrabold text-night mb-4">إدارة المعلمين والتوثيق</h3>
        {teachers.length === 0 ? (
          <p className="text-sm text-muted">لا يوجد معلمون مسجلون بعد.</p>
        ) : (
          <ul className="divide-y">
            {teachers.map((t) => (
              <li key={t.id} className="py-4 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="font-semibold text-sm">
                    {t.user.avatarEmoji} {t.user.name}{" "}
                    <span className="text-xs text-muted font-normal">({t.user.email})</span>
                  </p>
                  <p className="text-xs text-muted mt-1">
                    {t.qiraat} • ⭐ {t.rating.toFixed(1)} ({t.ratingCount} تقييم) • {t.availability.length} أوقات تواجد مُعرّفة
                  </p>
                </div>
                <VerifyToggle teacherProfileId={t.id} initialVerified={t.isVerified} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-extrabold text-night mb-4">آخر الحصص على المنصة</h3>
        {recentSessions.length === 0 ? (
          <p className="text-sm text-muted">لا توجد حصص بعد.</p>
        ) : (
          <ul className="divide-y">
            {recentSessions.map((s) => (
              <li key={s.id} className="py-3 flex items-center justify-between flex-wrap gap-2 text-sm">
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

function StatCard({ icon, label, value }: { icon: string; label: string; value: number | string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-xl font-extrabold text-night">{value}</div>
      <div className="text-xs text-muted mt-1">{label}</div>
    </div>
  );
}
