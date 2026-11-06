import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getLocale } from "@/i18n/getLocale";
import { makeT } from "@/i18n/t";
import { certificates } from "@/i18n/dictionaries/certificates";
import type { Locale } from "@/i18n/config";

function formatDate(d: Date, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

export default async function StudentCertificatesPage() {
  const user = await getCurrentUser();
  const locale = await getLocale();
  const t = makeT(certificates, locale);

  if (!user) return null;

  const certs = await prisma.certificate.findMany({
    where: { studentId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div className="animate-fade-up">
        <h1 className="text-2xl font-extrabold text-night">{t("pageTitle")}</h1>
        <p className="text-muted mt-1">{t("pageSubtitle")}</p>
      </div>

      {certs.length === 0 ? (
        <p className="text-muted text-sm">{t("noCertificatesYet")}</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {certs.map((c, i) => {
            const isMilestone = c.type === "MILESTONE";
            const iconBg = isMilestone ? "bg-amber-50" : "bg-purple-50";
            const iconColor = isMilestone ? "text-amber-600" : "text-purple-600";
            const icon = isMilestone ? "🏅" : "🎖️";
            const typeLabel = isMilestone ? t("milestoneType") : t("manualType");

            return (
              <div
                key={c.id}
                style={{ animationDelay: `${Math.min(i * 0.06, 0.4)}s` }}
                className="hover-lift animate-fade-up bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-12 h-12 rounded-2xl ${iconBg} ${iconColor} flex items-center justify-center text-2xl shrink-0`}>
                    {icon}
                  </span>
                  <div>
                    <p className={`text-xs font-bold ${iconColor}`}>{typeLabel}</p>
                    <p className="font-extrabold text-night text-sm">{c.title}</p>
                  </div>
                </div>
                <p className="text-xs text-muted">
                  {t("issuedOn")}: {formatDate(c.createdAt, locale)}
                </p>
                <a
                  href={`/api/certificates/${c.id}/pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center justify-center gap-2 bg-gradient-to-l from-dawn to-gold text-white font-bold text-xs px-4 py-2.5 rounded-full shadow-md hover:-translate-y-0.5 transition-all"
                >
                  {t("downloadPdf")}
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
