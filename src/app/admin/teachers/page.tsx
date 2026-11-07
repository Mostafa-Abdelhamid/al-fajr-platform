import { prisma } from "@/lib/prisma";
import VerifyToggle from "@/components/VerifyToggle";
import DeleteUserButton from "@/components/DeleteUserButton";
import DownloadScheduleButton from "@/components/DownloadScheduleButton";
import AdminSearchBar from "@/components/AdminSearchBar";
import AdminPagination from "@/components/AdminPagination";
import ExpandableListItem from "@/components/ExpandableListItem";
import { getLocale } from "@/i18n/getLocale";
import { makeT } from "@/i18n/t";
import { admin } from "@/i18n/dictionaries/admin";
import { DAYS_AR, DAYS_EN } from "@/i18n/dictionaries/teacher";
import AnimatedNumber from "@/components/AnimatedNumber";
import { staggerDelay } from "@/lib/animation";

const PAGE_SIZE = 10;

export default async function AdminTeachersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const locale = await getLocale();
  const t = makeT(admin, locale);
  const DAYS = locale === "ar" ? DAYS_AR : DAYS_EN;
  const { page: pageParam, q } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const query = q?.trim() || "";

  const where = query
    ? {
        user: {
          OR: [
            { name: { contains: query, mode: "insensitive" as const } },
            { email: { contains: query, mode: "insensitive" as const } },
          ],
        },
      }
    : {};

  const [totalCount, teachers] = await Promise.all([
    prisma.teacherProfile.count({ where }),
    prisma.teacherProfile.findMany({
      where,
      include: { user: true, availability: true },
      orderBy: { user: { createdAt: "desc" } },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-night">{t("teachersPageTitle")}</h1>
        <p className="text-sm text-muted mt-1">{t("teachersPageSubtitle")}</p>
      </div>

      <section className="hover-lift animate-fade-up bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-lg">👨‍🏫</span>
            <h3 className="font-extrabold text-night">{t("allTeachersTitle")}</h3>
            <span className="text-xs font-bold text-muted bg-gray-100 rounded-full px-2.5 py-1">
              <AnimatedNumber value={totalCount} />
            </span>
          </div>
          <div className="w-full sm:w-64">
            <AdminSearchBar placeholder={t("searchByNameEmail")} />
          </div>
        </div>

        {teachers.length === 0 ? (
          <p className="text-sm text-muted">{query ? t("noMatchingResults") : t("noTeachersYet")}</p>
        ) : (
          <ul className="space-y-3">
            {teachers.map((t2, i) => (
              <ExpandableListItem
                key={t2.id}
                style={{ animationDelay: staggerDelay(i) }}
                className="animate-fade-up rounded-2xl border border-gray-200 bg-gray-50 shadow-sm p-4 flex items-center justify-between flex-wrap gap-3 cursor-pointer hover:bg-amber-50 hover:border-dawn/40 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                summary={
                  <>
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-lg shrink-0">
                        {t2.user.avatarEmoji}
                      </span>
                      <div>
                        <p className="font-semibold text-sm">
                          {t2.user.name}{" "}
                          <span className="text-xs text-muted font-normal">({t2.user.email})</span>
                        </p>
                        <p className="text-xs text-muted mt-0.5">
                          {t2.qiraat.join(t("listSeparator"))} • ⭐ {t2.rating.toFixed(1)} ({t2.ratingCount} {t("ratingsLabel")}) • {t2.availability.length} {t("availabilitySlotsLabel")} • 🏆 {t2.points} {t("teacherPointsLabel")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DownloadScheduleButton teacherId={t2.user.id} />
                      <VerifyToggle teacherProfileId={t2.id} initialVerified={t2.isVerified} />
                      <DeleteUserButton userId={t2.user.id} userName={t2.user.name} />
                    </div>
                  </>
                }
                details={
                  <>
                    <p>
                      <span className="font-bold text-ink">{t("bioLabel")}:</span>{" "}
                      {t2.bio || t("noBioYet")}
                    </p>
                    <div>
                      <span className="font-bold text-ink">{t("availabilityListTitle")}:</span>{" "}
                      {t2.availability.length === 0 ? (
                        t("noAvailabilityYet")
                      ) : (
                        <ul className="mt-1 space-y-0.5">
                          {t2.availability.map((a) => (
                            <li key={a.id}>
                              {DAYS[a.dayOfWeek]} {t("availabilityRangeFrom")} {a.startTime} {t("availabilityRangeTo")} {a.endTime}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </>
                }
              />
            ))}
          </ul>
        )}

        <AdminPagination page={page} totalPages={totalPages} totalCount={totalCount} pageSize={PAGE_SIZE} />
      </section>
    </div>
  );
}
