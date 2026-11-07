import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getLocale } from "@/i18n/getLocale";
import { makeT } from "@/i18n/t";
import { certificates } from "@/i18n/dictionaries/certificates";
import StudentCertificatesList from "@/components/StudentCertificatesList";

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
        <StudentCertificatesList certs={certs} />
      )}
    </div>
  );
}
