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
      <div className="bg-fajr-night text-white rounded-2xl p-7 animate-fade-up">
        <h1 className="text-2xl font-extrabold">{t("dashboardTitle")}</h1>
        <p className="text-gray-300 mt-1 text-sm">{t("dashboardSubtitle")}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label={t("statStudents")} value={studentCount} delay={1} />
        <StatCard label={t("statTeachers")} value={teacherCount} delay={2} />
        <StatCard label={t("statUpcoming")} value={scheduledCount} delay={3} />
        <StatCard label={t("statCompleted")} value={completedCount} delay={4} />
        <StatCard label={t("statAvgRating")} value={avgRating} decimals={1} delay={5} />
        <StatCard label={t("statTotalPoints")} value={pointsAgg._sum.points ?? 0} delay={6} />
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <QuickLinkCard href="/admin/teachers" title={t("quickManageTeachersTitle")} desc={t("quickManageTeachersDesc")} />
        <QuickLinkCard href="/admin/students" title={t("quickManageStudentsTitle")} desc={t("quickManageStudentsDesc")} />
        <QuickLinkCard href="/admin/qiraat" title={t("quickManageQiraatTitle")} desc={t("quickManageQiraatDesc")} />
      </div>

      <section className="hover-lift animate-fade-up bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-extrabold text-night mb-4">{t("recentSessionsTitle")}</h3>
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
                  className="animate-fade-up rounded-xl border border-gray-200 bg-gray-50 shadow-sm p-4 flex items-center justify-between flex-wrap gap-2 text-sm cursor-pointer hover:bg-purple-50 hover:border-purple-300 hover:shadow-lg hover:-translate-y-0.5 transition-all"
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
  label,
  value,
  decimals = 0,
  delay = 0,
}: {
  label: string;
  value: number | null;
  decimals?: number;
  delay?: number;
}) {
  return (
    <div className={`hover-lift animate-fade-up stagger-${delay} bg-white rounded-2xl border border-gray-100 p-5 text-center`}>
      <div className="text-xl font-extrabold text-night">
        {value === null ? "—" : <AnimatedNumber value={value} decimals={decimals} />}
      </div>
      <div className="text-xs text-muted mt-1">{label}</div>
    </div>
  );
}

function QuickLinkCard({
  href,
  title,
  desc,
}: {
  href: string;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="hover-lift animate-fade-up bg-white rounded-2xl border border-gray-100 p-5 hover:border-dawn/40 transition-colors"
    >
      <p className="font-extrabold text-night text-sm">{title}</p>
      <p className="text-xs text-muted mt-0.5">{desc}</p>
    </Link>
  );
}
