import { prisma } from "@/lib/prisma";
import { getLocale } from "@/i18n/getLocale";
import { makeT } from "@/i18n/t";
import { certificates } from "@/i18n/dictionaries/certificates";
import { admin } from "@/i18n/dictionaries/admin";
import AdminSearchBar from "@/components/AdminSearchBar";
import AdminPagination from "@/components/AdminPagination";
import AnimatedNumber from "@/components/AnimatedNumber";
import ExpandableListItem from "@/components/ExpandableListItem";
import { staggerDelay } from "@/lib/animation";

const PAGE_SIZE = 15;

function formatDateTime(d: Date, locale: "ar" | "en") {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

export default async function AdminCertificatesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const locale = await getLocale();
  const t = makeT(certificates, locale);
  const tAdmin = makeT(admin, locale);
  const { page: pageParam, q } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const query = q?.trim() || "";

  const where = query
    ? {
        student: {
          OR: [
            { name: { contains: query, mode: "insensitive" as const } },
            { email: { contains: query, mode: "insensitive" as const } },
          ],
        },
      }
    : {};

  const [totalCount, certs] = await Promise.all([
    prisma.certificate.count({ where }),
    prisma.certificate.findMany({
      where,
      include: { student: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const teacherIds = Array.from(
    new Set(certs.map((c) => c.issuedByTeacherId).filter((id): id is string => !!id))
  );
  const teachers = teacherIds.length
    ? await prisma.user.findMany({ where: { id: { in: teacherIds } } })
    : [];
  const teacherNameById = new Map(teachers.map((tc) => [tc.id, tc.name]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-night">{t("adminPageTitle")}</h1>
        <p className="text-sm text-muted mt-1">{t("adminPageSubtitle")}</p>
      </div>

      <section className="hover-lift animate-fade-up bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center text-lg">🏅</span>
            <h3 className="font-extrabold text-night">{t("allCertificatesTitle")}</h3>
            <span className="text-xs font-bold text-muted bg-gray-100 rounded-full px-2.5 py-1">
              <AnimatedNumber value={totalCount} />
            </span>
          </div>
          <div className="w-full sm:w-64">
            <AdminSearchBar placeholder={tAdmin("searchByNameEmail")} />
          </div>
        </div>

        {certs.length === 0 ? (
          <p className="text-sm text-muted">{t("noCertificatesAtAll")}</p>
        ) : (
          <ul className="space-y-3">
            {certs.map((c, i) => {
              const isMilestone = c.type === "MILESTONE";
              const issuedBy = isMilestone
                ? t("issuedBySystem")
                : c.issuedByTeacherId
                ? teacherNameById.get(c.issuedByTeacherId) ?? t("issuedByUnknownTeacher")
                : t("issuedByUnknownTeacher");

              return (
                <ExpandableListItem
                  key={c.id}
                  style={{ animationDelay: staggerDelay(i) }}
                  className="animate-fade-up rounded-2xl border border-gray-200 bg-gray-50 shadow-sm p-4 flex items-center justify-between flex-wrap gap-3 cursor-pointer hover:bg-rose-50 hover:border-rose-300 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                  summary={
                    <>
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 ${
                            isMilestone ? "bg-amber-100" : "bg-purple-100"
                          }`}
                        >
                          {isMilestone ? "🏅" : "🎖️"}
                        </span>
                        <div>
                          <p className="font-semibold text-sm">{c.title}</p>
                          <p className="text-xs text-muted mt-0.5">
                            {t("issuedToLabel")}: {c.student.name} ({c.student.email}) • {t("issuedByLabel")}: {issuedBy}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted">{formatDateTime(c.createdAt, locale)}</span>
                        <a
                          href={`/api/certificates/${c.id}/pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-dawn hover:bg-amber-50 px-3 py-2 rounded-full transition"
                        >
                          {t("downloadPdf")}
                        </a>
                      </div>
                    </>
                  }
                  details={
                    isMilestone ? (
                      <p>{tAdmin("milestoneContext").replace("{count}", String(c.sessionsAtIssue ?? ""))}</p>
                    ) : (
                      <p>
                        <span className="font-bold text-ink">{tAdmin("certificateNoteLabel")}:</span>{" "}
                        {c.note || tAdmin("noCertificateNote")}
                      </p>
                    )
                  }
                />
              );
            })}
          </ul>
        )}

        <AdminPagination page={page} totalPages={totalPages} totalCount={totalCount} pageSize={PAGE_SIZE} />
      </section>
    </div>
  );
}
