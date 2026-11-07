import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getEffectiveStatus, statusLabel, STATUS_BADGE_CLASSES } from "@/lib/sessionStatus";
import { getLocale } from "@/i18n/getLocale";
import { makeT } from "@/i18n/t";
import { admin } from "@/i18n/dictionaries/admin";
import AnimatedNumber from "@/components/AnimatedNumber";
import AdminPagination from "@/components/AdminPagination";
import ExpandableListItem from "@/components/ExpandableListItem";
import { staggerDelay } from "@/lib/animation";
import type { Locale } from "@/i18n/config";

const PAGE_SIZE = 10;

function formatDateTime(d: Date, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-US", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const locale = await getLocale();
  const t = makeT(admin, locale);
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const [
    studentCount,
    teacherCount,
    scheduledCount,
    completedCount,
    pointsAgg,
    teachers,
    recentSessionsCount,
    recentSessions,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.user.count({ where: { role: "TEACHER" } }),
    prisma.session.count({ where: { status: "SCHEDULED", startAt: { gte: new Date() } } }),
    prisma.session.count({ where: { status: "COMPLETED" } }),
    prisma.user.aggregate({ where: { role: "STUDENT" }, _sum: { points: true } }),
    prisma.teacherProfile.findMany(),
    prisma.session.count(),
    prisma.session.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { student: true, teacher: true },
    }),
  ]);
  const totalPages = Math.max(1, Math.ceil(recentSessionsCount / PAGE_SIZE));

  const avgRating =
    teachers.length > 0 ? teachers.reduce((sum, t) => sum + t.rating, 0) / teachers.length : null;

  return (
    <div className="space-y-10">
      <div className="relative overflow-hidden bg-fajr-night text-white rounded-3xl p-7 animate-fade-up">
        <div className="absolute inset-0 bg-dot-grid opacity-30" />
        <div className="fajr-orb w-64 h-64 bg-gold/25 -top-20 -left-10" />
        <div className="relative flex items-center gap-3">
          <span className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl">🛡️</span>
          <div>
            <h1 className="text-2xl font-extrabold">{t("dashboardTitle")}</h1>
            <p className="text-gray-300 mt-1 text-sm">{t("dashboardSubtitle")}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard icon="🧑‍🎓" label={t("statStudents")} value={studentCount} color="bg-blue-50" delay={1} />
        <StatCard icon="👨‍🏫" label={t("statTeachers")} value={teacherCount} color="bg-amber-50" delay={2} />
        <StatCard icon="📅" label={t("statUpcoming")} value={scheduledCount} color="bg-purple-50" delay={3} />
        <StatCard icon="✅" label={t("statCompleted")} value={completedCount} color="bg-green-50" delay={4} />
        <StatCard icon="⭐" label={t("statAvgRating")} value={avgRating} decimals={1} color="bg-yellow-50" delay={5} />
        <StatCard icon="🏅" label={t("statTotalPoints")} value={pointsAgg._sum.points ?? 0} color="bg-red-50" delay={6} />
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <QuickLinkCard href="/admin/teachers" icon="👨‍🏫" title={t("quickManageTeachersTitle")} desc={t("quickManageTeachersDesc")} color="bg-amber-50" />
        <QuickLinkCard href="/admin/students" icon="🧑‍🎓" title={t("quickManageStudentsTitle")} desc={t("quickManageStudentsDesc")} color="bg-blue-50" />
        <QuickLinkCard href="/admin/qiraat" icon="📖" title={t("quickManageQiraatTitle")} desc={t("quickManageQiraatDesc")} color="bg-purple-50" />
      </div>

      <section className="hover-lift animate-fade-up bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-lg">📋</span>
          <h3 className="font-extrabold text-night">{t("recentSessionsTitle")}</h3>
        </div>
        {recentSessions.length === 0 ? (
          <p className="text-sm text-muted">{t("noSessionsYet")}</p>
        ) : (
          <ul className="space-y-3">
            {recentSessions.map((s, i) => {
              const effectiveStatus = getEffectiveStatus(s);
              return (
                <ExpandableListItem
                  key={s.id}
                  style={{ animationDelay: staggerDelay(i) }}
                  className="animate-fade-up rounded-2xl border border-gray-200 bg-gray-50 shadow-sm p-4 flex items-center justify-between flex-wrap gap-2 text-sm cursor-pointer hover:bg-purple-50 hover:border-purple-300 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                  summary={
                    <>
                      <span>
                        {s.student.avatarEmoji} {s.student.name} {t("sessionArrow")} {s.teacher.avatarEmoji} {s.teacher.name}
                      </span>
                      <span className="text-xs text-muted">{formatDateTime(s.startAt, locale)}</span>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_BADGE_CLASSES[effectiveStatus]}`}>
                        {statusLabel(effectiveStatus, locale)}
                      </span>
                    </>
                  }
                  details={
                    <>
                      <p>
                        <span className="font-bold text-ink">{t("sessionEndLabel")}:</span>{" "}
                        {formatDateTime(s.endAt, locale)}
                      </p>
                      {s.surahFocus && (
                        <p>
                          <span className="font-bold text-ink">{t("sessionFocusLabel")}:</span> {s.surahFocus}
                        </p>
                      )}
                      {s.teacherNotes && (
                        <p>
                          <span className="font-bold text-ink">{t("teacherNoteToStudentLabel")}:</span>{" "}
                          {s.teacherNotes}
                        </p>
                      )}
                      {s.rating !== null && (
                        <p>
                          <span className="font-bold text-ink">{t("teacherRatingOfStudentLabel")}:</span>{" "}
                          {"★".repeat(s.rating)}
                          {"☆".repeat(5 - s.rating)}
                        </p>
                      )}
                      {s.studentRating !== null && (
                        <p>
                          <span className="font-bold text-ink">{t("studentRatingOfTeacherLabel")}:</span>{" "}
                          {"★".repeat(s.studentRating)}
                          {"☆".repeat(5 - s.studentRating)}
                        </p>
                      )}
                      <Link href={`/session/${s.id}`} className="inline-block text-dawn font-bold hover:underline">
                        {t("sessionArrow")} /session/{s.id}
                      </Link>
                    </>
                  }
                />
              );
            })}
          </ul>
        )}

        <AdminPagination page={page} totalPages={totalPages} totalCount={recentSessionsCount} pageSize={PAGE_SIZE} />
      </section>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  decimals = 0,
  color = "bg-gray-50",
  delay = 0,
}: {
  icon: string;
  label: string;
  value: number | null;
  decimals?: number;
  color?: string;
  delay?: number;
}) {
  return (
    <div className={`hover-lift animate-fade-up stagger-${delay} bg-white rounded-2xl border border-gray-100 p-5 text-center`}>
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center text-xl mx-auto mb-2`}>
        {icon}
      </div>
      <div className="text-xl font-extrabold text-night">
        {value === null ? "—" : <AnimatedNumber value={value} decimals={decimals} />}
      </div>
      <div className="text-xs text-muted mt-1">{label}</div>
    </div>
  );
}

function QuickLinkCard({
  href,
  icon,
  title,
  desc,
  color = "bg-amber-50",
}: {
  href: string;
  icon: string;
  title: string;
  desc: string;
  color?: string;
}) {
  return (
    <Link
      href={href}
      className="hover-lift animate-fade-up bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 hover:border-dawn/40 transition-colors"
    >
      <span className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center text-xl shrink-0`}>
        {icon}
      </span>
      <div>
        <p className="font-extrabold text-night text-sm">{title}</p>
        <p className="text-xs text-muted mt-0.5">{desc}</p>
      </div>
    </Link>
  );
}
