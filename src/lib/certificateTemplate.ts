import { wrapHtmlDocument } from "./pdf";
import { makeT } from "@/i18n/t";
import { certificates } from "@/i18n/dictionaries/certificates";
import { dirForLocale, type Locale } from "@/i18n/config";

// A reusable ornamental corner flourish. Placed once per corner and mirrored
// via CSS transforms, so the same markup covers all four — no image assets
// needed, Chromium renders inline SVG (and the Arabic text around it) with
// full fidelity.
function cornerFlourish(): string {
  return `
    <svg width="110" height="110" viewBox="0 0 100 100" fill="none">
      <path d="M8,92 C8,46 46,8 92,8" stroke="#E8B923" stroke-width="2.5"/>
      <path d="M8,68 C8,34 34,8 68,8" stroke="#8A1538" stroke-width="1.5"/>
      <path d="M8,44 C8,24 24,8 44,8" stroke="#E8B923" stroke-width="1" opacity="0.7"/>
      <circle cx="92" cy="8" r="4.5" fill="#E8B923"/>
      <circle cx="8" cy="92" r="4.5" fill="#8A1538"/>
      <circle cx="68" cy="8" r="2.5" fill="#8A1538"/>
      <circle cx="8" cy="68" r="2.5" fill="#E8B923"/>
    </svg>
  `;
}

function sectionDivider(): string {
  return `
    <div style="display:flex; align-items:center; justify-content:center; gap:14px; margin:20px 0;">
      <span style="height:1px; width:90px; background:linear-gradient(90deg, transparent, #E8B923);"></span>
      <span style="color:#8A1538; font-size:16px;">✦</span>
      <span style="height:1px; width:90px; background:linear-gradient(270deg, transparent, #E8B923);"></span>
    </div>
  `;
}

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
    <div style="width:100%; height:100vh; display:flex; align-items:center; justify-content:center; background:linear-gradient(160deg,#fdf6ea 0%,#fff 55%,#fdf6ea 100%); padding:22px; box-sizing:border-box;">
      <div style="position:relative; width:100%; max-width:1040px; max-height:100%; background:#fffdf8; border-radius:14px; padding:14px; box-shadow:0 24px 70px rgba(74,13,31,0.18); box-sizing:border-box;">

        <!-- outer thin gold frame, inset from the card edge -->
        <div style="position:absolute; inset:14px; border:2px solid #E8B923; border-radius:10px; pointer-events:none;"></div>
        <!-- inner solid maroon frame -->
        <div style="position:absolute; inset:26px; border:4px solid #8A1538; border-radius:6px; pointer-events:none;"></div>

        <!-- subtle tiled Islamic star-pattern watermark -->
        <svg width="100%" height="100%" style="position:absolute; inset:0; opacity:0.05; pointer-events:none;">
          <defs>
            <pattern id="star" width="70" height="70" patternUnits="userSpaceOnUse" patternTransform="rotate(12)">
              <path d="M35 5 L42 28 L65 35 L42 42 L35 65 L28 42 L5 35 L28 28 Z" fill="#8A1538"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#star)"/>
        </svg>

        <!-- corner flourishes -->
        <div style="position:absolute; top:22px; ${dir === "rtl" ? "right" : "left"}:22px;">${cornerFlourish()}</div>
        <div style="position:absolute; top:22px; ${dir === "rtl" ? "left" : "right"}:22px; transform:scaleX(-1);">${cornerFlourish()}</div>
        <div style="position:absolute; bottom:22px; ${dir === "rtl" ? "right" : "left"}:22px; transform:scaleY(-1);">${cornerFlourish()}</div>
        <div style="position:absolute; bottom:22px; ${dir === "rtl" ? "left" : "right"}:22px; transform:scale(-1,-1);">${cornerFlourish()}</div>

        <!-- soft glow accents -->
        <div style="position:absolute; top:-60px; ${dir === "rtl" ? "left" : "right"}:-60px; width:220px; height:220px; border-radius:9999px; background:radial-gradient(circle, rgba(232,185,35,0.22), transparent 70%); pointer-events:none;"></div>
        <div style="position:absolute; bottom:-70px; ${dir === "rtl" ? "right" : "left"}:-70px; width:260px; height:260px; border-radius:9999px; background:radial-gradient(circle, rgba(138,21,56,0.1), transparent 70%); pointer-events:none;"></div>

        <div style="position:relative; text-align:center; padding:38px 72px 26px;">
          <div style="display:inline-flex; align-items:center; gap:10px; font-weight:800; font-size:19px; color:#8A1538; margin-bottom:4px;">
            🌅 ${t("sealText")}
          </div>
          <p style="font-size:12px; color:#8a8a8a; margin:0 0 18px;">${t("platformTagline")}</p>

          <div style="display:inline-block; background:linear-gradient(90deg,#c99a1f,#e8b923); color:#fff; font-weight:700; font-size:13px; padding:6px 22px; border-radius:9999px; margin-bottom:18px; box-shadow:0 6px 16px rgba(201,154,31,0.35);">
            ✦ ${typeLabel} ✦
          </div>

          <h1 style="font-weight:800; font-size:36px; color:#4a0d1f; margin:0 0 10px; line-height:1.3;">
            ${cert.title || t("certificateDefaultTitle")}
          </h1>

          ${sectionDivider()}

          <p style="font-size:15px; color:#555; margin:0 0 8px;">${locale === "ar" ? "مُنحت لـ" : "Awarded to"}</p>
          <p style="font-weight:800; font-size:34px; color:#8A1538; margin:0 0 22px; display:inline-block; position:relative; padding:0 16px 10px;">
            ${cert.studentName}
            <span style="position:absolute; bottom:0; left:50%; transform:translateX(-50%); width:70%; height:3px; background:linear-gradient(90deg, transparent, #E8B923, transparent);"></span>
          </p>

          <p style="font-size:16px; color:#3a3a3a; max-width:560px; margin:0 auto 24px; line-height:1.9;">
            ${congrats}
          </p>

          <div style="display:flex; align-items:center; justify-content:center; gap:22px; margin-top:8px;">
            <span style="color:#E8B923; font-size:18px;">❋</span>
            <div style="width:72px; height:72px; border-radius:9999px; background:linear-gradient(135deg,#e8b923,#c99a1f); display:flex; align-items:center; justify-content:center; font-size:30px; box-shadow:0 10px 24px rgba(201,154,31,0.45); border:3px solid #fffdf8; outline:2px solid #E8B923;">
              ⭐
            </div>
            <span style="color:#E8B923; font-size:18px;">❋</span>
          </div>

          <p style="font-size:13px; color:#8a8a8a; margin-top:16px;">${t("issuedOn")}: ${dateStr}</p>
        </div>
      </div>
    </div>
  `;

  return wrapHtmlDocument(body, dir);
}
