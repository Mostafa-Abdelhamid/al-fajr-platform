import { wrapHtmlDocument } from "./pdf";
import { makeT } from "@/i18n/t";
import { certificates } from "@/i18n/dictionaries/certificates";
import { dirForLocale, type Locale } from "@/i18n/config";

export function buildCertificateHtml(
  cert: {
    title: string;
    studentName: string;
    type: string;
    sessionsAtIssue: number | null;
    note: string;
    createdAt: Date;
  },
  locale: Locale
): string {
  const t = makeT(certificates, locale);
  const dir = dirForLocale(locale);

  const dateStr = new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(cert.createdAt);

  const congrats =
    cert.type === "MILESTONE"
      ? t("milestoneCongrats").replace("{count}", String(cert.sessionsAtIssue ?? ""))
      : cert.note
      ? cert.note
      : t("manualCongrats");

  const typeLabel = cert.type === "MILESTONE" ? t("milestoneType") : t("manualType");

  const body = `
    <div style="width:100%; min-height:100vh; display:flex; align-items:center; justify-content:center; background:linear-gradient(160deg,#fdf6ea 0%,#fff 60%,#fdf6ea 100%); padding:40px;">
      <div style="position:relative; width:100%; max-width:720px; background:#ffffff; border-radius:28px; padding:64px 56px; box-shadow:0 20px 60px rgba(74,13,31,0.12); border:10px solid #8a1538; overflow:hidden;">
        <div style="position:absolute; top:-80px; ${dir === "rtl" ? "left" : "right"}:-80px; width:220px; height:220px; border-radius:9999px; background:radial-gradient(circle, rgba(232,185,35,0.25), transparent 70%);"></div>
        <div style="position:absolute; bottom:-90px; ${dir === "rtl" ? "right" : "left"}:-90px; width:260px; height:260px; border-radius:9999px; background:radial-gradient(circle, rgba(138,21,56,0.12), transparent 70%);"></div>

        <div style="position:relative; text-align:center;">
          <div style="display:inline-flex; align-items:center; gap:10px; font-weight:800; font-size:20px; color:#8a1538; margin-bottom:6px;">
            🌅 ${t("sealText")}
          </div>
          <p style="font-size:12px; color:#8a8a8a; margin:0 0 28px;">${t("platformTagline")}</p>

          <div style="display:inline-block; background:linear-gradient(90deg,#c99a1f,#e8b923); color:#fff; font-weight:700; font-size:13px; padding:6px 20px; border-radius:9999px; margin-bottom:22px;">
            ${typeLabel}
          </div>

          <h1 style="font-weight:800; font-size:38px; color:#4a0d1f; margin:0 0 28px; line-height:1.3;">
            ${cert.title || t("certificateDefaultTitle")}
          </h1>

          <p style="font-size:15px; color:#555; margin:0 0 6px;">${locale === "ar" ? "مُنحت لـ" : "Awarded to"}</p>
          <p style="font-weight:800; font-size:32px; color:#8a1538; margin:0 0 26px; border-bottom:3px solid #e8b923; display:inline-block; padding-bottom:8px;">
            ${cert.studentName}
          </p>

          <p style="font-size:16px; color:#3a3a3a; max-width:520px; margin:0 auto 34px; line-height:1.9;">
            ${congrats}
          </p>

          <div style="display:flex; align-items:center; justify-content:center; gap:60px; margin-top:20px;">
            <div style="text-align:center;">
              <div style="width:64px; height:64px; border-radius:9999px; background:linear-gradient(135deg,#e8b923,#c99a1f); display:flex; align-items:center; justify-content:center; font-size:28px; margin:0 auto 10px; box-shadow:0 8px 20px rgba(201,154,31,0.4);">
                ⭐
              </div>
            </div>
          </div>

          <p style="font-size:13px; color:#8a8a8a; margin-top:10px;">${t("issuedOn")}: ${dateStr}</p>
        </div>
      </div>
    </div>
  `;

  return wrapHtmlDocument(body, dir);
}
