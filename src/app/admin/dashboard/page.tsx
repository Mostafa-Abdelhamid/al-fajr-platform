import Link from "next/link";
import { prisma } from "@/lib/prisma";

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
      prisma.teacherProfile.findMany(),
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

      <div className="grid sm:grid-cols-3 gap-4">
        <QuickLinkCard href="/admin/teachers" icon="👨‍🏫" title="إدارة المعلمين" desc="التوثيق والحذف" />
        <QuickLinkCard href="/admin/students" icon="🧑‍🎓" title="إدارة الطلاب" desc="عرض وحذف الحسابات" />
        <QuickLinkCard href="/admin/qiraat" icon="📖" title="إدارة القراءات" desc="إضافة وحذف الروايات" />
      </div>

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
                className="py-3 px-2 -mx-2 rounded-xl flex items-center justify-between flex-wrap gap-2 text-sm hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5 transition-all"
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

function QuickLinkCard({ href, icon, title, desc }: { href: string; icon: string; title: string; desc: string }) {
  return (
    <Link
      href={href}
      className="hover-lift animate-fade-up bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 hover:border-dawn/40 transition-colors"
    >
      <span className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center text-xl shrink-0">
        {icon}
      </span>
      <div>
        <p className="font-extrabold text-night text-sm">{title}</p>
        <p className="text-xs text-muted mt-0.5">{desc}</p>
      </div>
    </Link>
  );
}
