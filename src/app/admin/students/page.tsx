import { prisma } from "@/lib/prisma";
import DeleteUserButton from "@/components/DeleteUserButton";
import AdminSearchBar from "@/components/AdminSearchBar";
import AdminPagination from "@/components/AdminPagination";

const PAGE_SIZE = 10;

export default async function AdminStudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const { page: pageParam, q } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const query = q?.trim() || "";

  const where = {
    role: "STUDENT" as const,
    ...(query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" as const } },
            { email: { contains: query, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [totalCount, students] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-night">إدارة الطلاب</h1>
        <p className="text-sm text-muted mt-1">عرض حسابات الطلاب وحذفها عند الحاجة.</p>
      </div>

      <section className="hover-lift animate-fade-up bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-lg">🧑‍🎓</span>
            <h3 className="font-extrabold text-night">كل الطلاب</h3>
            <span className="text-xs font-bold text-muted bg-gray-100 rounded-full px-2.5 py-1">{totalCount}</span>
          </div>
          <div className="w-full sm:w-64">
            <AdminSearchBar placeholder="ابحث بالاسم أو البريد الإلكتروني..." />
          </div>
        </div>

        {students.length === 0 ? (
          <p className="text-sm text-muted">{query ? "لا توجد نتائج مطابقة." : "لا يوجد طلاب مسجلون بعد."}</p>
        ) : (
          <ul className="divide-y">
            {students.map((s) => (
              <li
                key={s.id}
                className="py-3 px-2 -mx-2 rounded-xl flex items-center justify-between flex-wrap gap-3 hover:bg-blue-50/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg shrink-0">
                    {s.avatarEmoji}
                  </span>
                  <div>
                    <p className="font-semibold text-sm">
                      {s.name} <span className="text-xs text-muted font-normal">({s.email})</span>
                    </p>
                    <p className="text-xs text-muted mt-0.5">
                      ⭐ {s.points} نقطة • 🔥 {s.streak} متتالية
                    </p>
                  </div>
                </div>
                <DeleteUserButton userId={s.id} userName={s.name} />
              </li>
            ))}
          </ul>
        )}

        <AdminPagination page={page} totalPages={totalPages} totalCount={totalCount} pageSize={PAGE_SIZE} />
      </section>
    </div>
  );
}
