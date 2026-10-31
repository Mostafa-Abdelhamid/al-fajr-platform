import { prisma } from "@/lib/prisma";
import VerifyToggle from "@/components/VerifyToggle";
import DeleteUserButton from "@/components/DeleteUserButton";
import AdminSearchBar from "@/components/AdminSearchBar";
import AdminPagination from "@/components/AdminPagination";

const PAGE_SIZE = 10;

export default async function AdminTeachersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
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
        <h1 className="text-xl font-extrabold text-night">إدارة المعلمين والتوثيق</h1>
        <p className="text-sm text-muted mt-1">توثيق حسابات المعلمين أو حذفها عند الحاجة.</p>
      </div>

      <section className="hover-lift animate-fade-up bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-lg">👨‍🏫</span>
            <h3 className="font-extrabold text-night">كل المعلمين</h3>
            <span className="text-xs font-bold text-muted bg-gray-100 rounded-full px-2.5 py-1">{totalCount}</span>
          </div>
          <div className="w-full sm:w-64">
            <AdminSearchBar placeholder="ابحث بالاسم أو البريد الإلكتروني..." />
          </div>
        </div>

        {teachers.length === 0 ? (
          <p className="text-sm text-muted">{query ? "لا توجد نتائج مطابقة." : "لا يوجد معلمون مسجلون بعد."}</p>
        ) : (
          <ul className="space-y-3">
            {teachers.map((t, i) => (
              <li
                key={t.id}
                style={{ animationDelay: `${Math.min(i * 0.05, 0.4)}s` }}
                className="animate-fade-up rounded-2xl border border-gray-200 bg-gray-50 shadow-sm p-4 flex items-center justify-between flex-wrap gap-3 cursor-pointer hover:bg-white hover:border-dawn/40 hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-lg shrink-0">
                    {t.user.avatarEmoji}
                  </span>
                  <div>
                    <p className="font-semibold text-sm">
                      {t.user.name}{" "}
                      <span className="text-xs text-muted font-normal">({t.user.email})</span>
                    </p>
                    <p className="text-xs text-muted mt-0.5">
                      {t.qiraat.join("، ")} • ⭐ {t.rating.toFixed(1)} ({t.ratingCount} تقييم) • {t.availability.length} أوقات تواجد مُعرّفة
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <VerifyToggle teacherProfileId={t.id} initialVerified={t.isVerified} />
                  <DeleteUserButton userId={t.user.id} userName={t.user.name} />
                </div>
              </li>
            ))}
          </ul>
        )}

        <AdminPagination page={page} totalPages={totalPages} totalCount={totalCount} pageSize={PAGE_SIZE} />
      </section>
    </div>
  );
}
