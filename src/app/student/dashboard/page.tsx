import type { CSSProperties } from "react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getLocale } from "@/i18n/getLocale";
import { makeT } from "@/i18n/t";
import { student, progressStatusLabel } from "@/i18n/dictionaries/student";
import { badgeLabel } from "@/i18n/dictionaries/badges";
import DownloadReportButton from "@/components/DownloadReportButton";
import StudentHistoryList from "@/components/StudentHistoryList";
import AnimatedNumber from "@/components/AnimatedNumber";
import { staggerDelay } from "@/lib/animation";
import type { Locale } from "@/i18n/config";

function formatDateTime(d: Date, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-US", {
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

  const locale = await getLocale();
  const t = makeT(student, locale);

  const [upcoming, past, progress, badges] = await Promise.all([
    prisma.session.findMany({
      where: { studentId: user.id, status: "SCHEDULED", startAt: { gte: new Date() } },
      orderBy: { startAt: "asc" },
      include: { teacher: true },
    }),
    prisma.session.findMany({
      where: { studentId: user.id, status: "COMPLETED" },
      orderBy: { startAt: "desc" },
      include: { teacher: true },
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
      <div className="animate-fade-up flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-night">
            {t("welcome").replace("{name}", user.name)}
          </h1>
          <p className="text-muted mt-1">{t("dashboardSubtitle")}</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href="/student/certificates"
            className="text-sm font-bold text-night bg-white border border-gray-200 rounded-full px-5 py-2.5 hover:border-dawn/40 transition"
          >
            🏅 {t("myCertificatesLink")}
          </Link>
          <DownloadReportButton studentId={user.id} />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon="⭐" label={t("pointsLabel")} value={user.points} delay={1} />
        <StatCard icon="🔥" label={t("streakLabel")} value={user.streak} suffix={t("streakSuffix")} delay={2} />
        <StatCard icon="✅" label={t("completedSessionsLabel")} value={completedCount} delay={3} />
        <StatCard icon="🏅" label={t("badgesLabel")} value={badges.length} delay={4} />
      </div>

      {/* Next session */}
      <section className="relative overflow-hidden animate-fade-up stagger-3 bg-fajr-night text-white rounded-3xl p-7">
        <div className="absolute inset-0 bg-dot-grid opacity-30" />
        <div className="fajr-orb w-56 h-56 bg-gold/25 -top-16 -right-10" />
        {nextSession ? (
          <div className="relative flex flex-wrap items-center justify-between gap-5">
            <div>
              <span className="text-gold-light text-xs font-bold">{t("nextSessionLabel")}</span>
              <h2 className="text-xl font-extrabold mt-1">
                {t("withTeacher")} {nextSession.teacher.name} {nextSession.teacher.avatarEmoji}
              </h2>
              <p className="text-gray-300 text-sm mt-1">
                {formatDateTime(nextSession.startAt, locale)}
                {nextSession.surahFocus && ` • ${t("sessionFocusPrefix")} ${nextSession.surahFocus}`}
              </p>
            </div>
            <Link
              href={`/session/${nextSession.id}`}
              className="bg-gradient-to-l from-dawn to-gold text-white font-bold px-6 py-3 rounded-full hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-400/30 transition-all animate-pulse-ring"
            >
              🎥 {t("enterSession")}
            </Link>
          </div>
        ) : (
          <div className="relative flex flex-wrap items-center justify-between gap-5">
            <div>
              <h2 className="text-xl font-extrabold">{t("noUpcomingTitle")}</h2>
              <p className="text-gray-300 text-sm mt-1">{t("noUpcomingSubtitle")}</p>
            </div>
            <Link
              href="/student/book"
              className="bg-gradient-to-l from-dawn to-gold text-white font-bold px-6 py-3 rounded-full hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-400/30 transition-all"
            >
              {t("bookNow")}
            </Link>
          </div>
        )}
      </section>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Progress */}
        <section className="hover-lift animate-fade-up bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-extrabold text-night mb-4">{t("progressTitle")}</h3>
          {progress.length === 0 ? (
            <p className="text-sm text-muted">{t("progressEmpty")}</p>
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
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {progressStatusLabel(p.status, locale)}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${barColor} animate-grow-bar`}
                        style={{ "--bar-width": `${pct}%` } as CSSProperties}
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
          <h3 className="font-extrabold text-night mb-4">{t("badgesTitle")}</h3>
          {badges.length === 0 ? (
            <p className="text-sm text-muted">{t("badgesEmpty")}</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {badges.map((b, i) => (
                <div
                  key={b.id}
                  style={{ animationDelay: staggerDelay(i + 1) }}
                  className="animate-scale-in flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-4 py-2 transition-transform hover:scale-105"
                  title={badgeLabel(b.type, locale)}
                >
                  <span className="text-xl">{b.icon}</span>
                  <span className="text-sm font-bold text-night">{badgeLabel(b.type, locale)}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* History */}
      <section className="hover-lift animate-fade-up bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-extrabold text-night mb-4">{t("historyTitle")}</h3>
        <StudentHistoryList sessions={past} />
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
        <AnimatedNumber value={value} suffix={suffix} />
      </div>
      <div className="text-xs text-muted mt-1">{label}</div>
    </div>
  );
}
