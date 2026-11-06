import { prisma } from "./prisma";
import { wrapHtmlDocument } from "./pdf";
import { badgeLabel } from "@/i18n/dictionaries/badges";
import { makeT } from "@/i18n/t";
import { report } from "@/i18n/dictionaries/report";
import type { Locale } from "@/i18n/config";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function progressStatusDisplay(status: string, t: (k: keyof typeof report.ar) => string) {
  if (status === "مكتمل") return { label: t("statusCompleted"), color: "#1f9d55", bg: "#eafaf0" };
  if (status === "مراجعة") return { label: t("statusInReview"), color: "#2563eb", bg: "#eaf1fe" };
  return { label: t("statusInProgress"), color: "#c99a1f", bg: "#fdf6e3" };
}

function stars(rating: number | null): string {
  if (!rating) return "—";
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

export async function buildStudentReportHtml(studentId: string, locale: Locale): Promise<string> {
  const t = makeT(report, locale);
  const dir = locale === "ar" ? "rtl" : "ltr";

  const [student, progressList, badges, completedSessions, certificateCount] = await Promise.all([
    prisma.user.findUnique({ where: { id: studentId } }),
    prisma.progress.findMany({ where: { studentId }, orderBy: { updatedAt: "desc" } }),
    prisma.badge.findMany({ where: { studentId }, orderBy: { earnedAt: "desc" } }),
    prisma.session.findMany({
      where: { studentId, status: "COMPLETED" },
      orderBy: { startAt: "desc" },
      include: { teacher: true },
    }),
    prisma.certificate.count({ where: { studentId } }),
  ]);

  if (!student) {
    return wrapHtmlDocument(`<div style="padding:60px;text-align:center;">Student not found</div>`, dir);
  }

  const stats: { label: string; value: string | number; color: string; bg: string }[] = [
    { label: t("pointsLabel"), value: student.points, color: "#c99a1f", bg: "#fdf6e3" },
    { label: t("streakLabel"), value: `${student.streak} ${t("daysUnit")}`, color: "#0d9488", bg: "#e6fbf8" },
    { label: t("completedSessionsLabel"), value: completedSessions.length, color: "#2563eb", bg: "#eaf1fe" },
    { label: t("badgesLabel"), value: badges.length, color: "#9333ea", bg: "#f6ecff" },
    { label: t("certificatesLabel"), value: certificateCount, color: "#e11d48", bg: "#feecef" },
  ];

  const statTilesHtml = stats
    .map(
      (s) => `
      <div style="flex:1; min-width:140px; background:${s.bg}; border-radius:16px; padding:18px; text-align:center;">
        <div style="font-size:28px; font-weight:800; color:${s.color};">${s.value}</div>
        <div style="font-size:13px; color:#555; margin-top:4px; font-weight:700;">${s.label}</div>
      </div>`
    )
    .join("");

  const progressRowsHtml = progressList.length
    ? progressList
        .map((p) => {
          const st = progressStatusDisplay(p.status, t);
          return `
          <tr>
            <td style="padding:12px 16px; border-bottom:1px solid #f0e8ea; font-weight:700;">${escapeHtml(p.surah)}</td>
            <td style="padding:12px 16px; border-bottom:1px solid #f0e8ea;">
              <span style="display:inline-block; padding:4px 14px; border-radius:999px; background:${st.bg}; color:${st.color}; font-weight:800; font-size:12px;">${st.label}</span>
            </td>
            <td style="padding:12px 16px; border-bottom:1px solid #f0e8ea; color:#777; font-size:13px;">${formatDate(p.updatedAt, locale)}</td>
          </tr>`;
        })
        .join("")
    : `<tr><td colspan="3" style="padding:20px; text-align:center; color:#999;">${t("progressEmpty")}</td></tr>`;

  const badgesHtml = badges.length
    ? `<div style="display:flex; flex-wrap:wrap; gap:10px;">
        ${badges
          .map(
            (b) => `
          <div style="display:flex; align-items:center; gap:8px; background:#fdf6e3; border:1px solid #f0e0b0; border-radius:14px; padding:10px 16px;">
            <span style="font-size:20px;">${b.icon}</span>
            <span style="font-weight:800; color:#2b0e17; font-size:13px;">${escapeHtml(badgeLabel(b.type, locale))}</span>
          </div>`
          )
          .join("")}
      </div>`
    : `<p style="color:#999; text-align:center; padding:16px;">${t("badgesEmpty")}</p>`;

  const sessionsRowsHtml = completedSessions.length
    ? completedSessions
        .map(
          (s) => `
        <tr>
          <td style="padding:10px 14px; border-bottom:1px solid #f0e8ea; font-size:13px; color:#555;">${formatDate(s.startAt, locale)}</td>
          <td style="padding:10px 14px; border-bottom:1px solid #f0e8ea; font-weight:700;">${escapeHtml(s.teacher.name)}</td>
          <td style="padding:10px 14px; border-bottom:1px solid #f0e8ea; font-size:13px; color:#555;">${escapeHtml(s.surahFocus || "—")}</td>
          <td style="padding:10px 14px; border-bottom:1px solid #f0e8ea; color:#e8b923; font-weight:700;">${stars(s.rating)}</td>
        </tr>`
        )
        .join("")
    : `<tr><td colspan="4" style="padding:20px; text-align:center; color:#999;">${t("sessionsEmpty")}</td></tr>`;

  const body = `
  <div style="padding:0 0 48px 0;">
    <div style="background:linear-gradient(135deg,#4a0d1f 0%,#8a1538 100%); color:#fff; padding:40px 48px;">
      <div style="font-size:14px; font-weight:700; opacity:0.85;">🌅 Al-Fajr Platform</div>
      <h1 style="font-size:30px; font-weight:800; margin:10px 0 4px;">${t("reportTitle")}</h1>
      <p style="font-size:14px; opacity:0.85; margin:0 0 18px;">${t("reportSubtitle")}</p>
      <div style="display:flex; align-items:center; gap:12px; margin-top:10px;">
        <span style="font-size:32px;">${student.avatarEmoji}</span>
        <div>
          <div style="font-size:19px; font-weight:800;">${escapeHtml(student.name)}</div>
          <div style="font-size:12px; opacity:0.75;">${escapeHtml(student.email)}</div>
        </div>
      </div>
    </div>

    <div style="padding:32px 48px 0;">
      <div style="display:flex; gap:14px; flex-wrap:wrap;">${statTilesHtml}</div>

      <h2 style="font-size:18px; font-weight:800; color:#4a0d1f; margin:34px 0 14px; border-${dir === "rtl" ? "right" : "left"}:5px solid #8a1538; padding-${dir === "rtl" ? "right" : "left"}:12px;">
        ${t("progressSectionTitle")}
      </h2>
      <table style="width:100%; border-collapse:collapse; background:#fff; border-radius:12px; overflow:hidden;">
        <thead>
          <tr style="background:#fbf3df;">
            <th style="padding:10px 16px; text-align:${dir === "rtl" ? "right" : "left"}; font-size:12px; color:#8a1538;">${t("surahColumn")}</th>
            <th style="padding:10px 16px; text-align:${dir === "rtl" ? "right" : "left"}; font-size:12px; color:#8a1538;">${t("statusColumn")}</th>
            <th style="padding:10px 16px; text-align:${dir === "rtl" ? "right" : "left"}; font-size:12px; color:#8a1538;">${t("updatedColumn")}</th>
          </tr>
        </thead>
        <tbody>${progressRowsHtml}</tbody>
      </table>

      <h2 style="font-size:18px; font-weight:800; color:#4a0d1f; margin:34px 0 14px; border-${dir === "rtl" ? "right" : "left"}:5px solid #8a1538; padding-${dir === "rtl" ? "right" : "left"}:12px;">
        ${t("badgesSectionTitle")}
      </h2>
      ${badgesHtml}

      <h2 style="font-size:18px; font-weight:800; color:#4a0d1f; margin:34px 0 14px; border-${dir === "rtl" ? "right" : "left"}:5px solid #8a1538; padding-${dir === "rtl" ? "right" : "left"}:12px;">
        ${t("sessionsSectionTitle")}
      </h2>
      <table style="width:100%; border-collapse:collapse; background:#fff; border-radius:12px; overflow:hidden;">
        <thead>
          <tr style="background:#fbf3df;">
            <th style="padding:8px 14px; text-align:${dir === "rtl" ? "right" : "left"}; font-size:12px; color:#8a1538;">${t("dateColumn")}</th>
            <th style="padding:8px 14px; text-align:${dir === "rtl" ? "right" : "left"}; font-size:12px; color:#8a1538;">${t("teacherColumn")}</th>
            <th style="padding:8px 14px; text-align:${dir === "rtl" ? "right" : "left"}; font-size:12px; color:#8a1538;">${t("focusColumn")}</th>
            <th style="padding:8px 14px; text-align:${dir === "rtl" ? "right" : "left"}; font-size:12px; color:#8a1538;">${t("ratingColumn")}</th>
          </tr>
        </thead>
        <tbody>${sessionsRowsHtml}</tbody>
      </table>

      <p style="margin-top:36px; font-size:11px; color:#aaa; text-align:center;">
        ${t("generatedOn")}: ${formatDate(new Date(), locale)}
      </p>
    </div>
  </div>`;

  return wrapHtmlDocument(body, dir);
}
