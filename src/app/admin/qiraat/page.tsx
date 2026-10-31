import { prisma } from "@/lib/prisma";
import QiraatManager from "@/components/QiraatManager";

export default async function AdminQiraatPage() {
  const options = await prisma.qiraatOption.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  const groups: { reciter: string; riwayat: { id: string; riwaya: string }[] }[] = [];
  for (const o of options) {
    let group = groups.find((g) => g.reciter === o.reciter);
    if (!group) {
      group = { reciter: o.reciter, riwayat: [] };
      groups.push(group);
    }
    group.riwayat.push({ id: o.id, riwaya: o.riwaya });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-night">إدارة القراءات</h1>
        <p className="text-sm text-muted mt-1">
          أضف أو احذف الروايات التي يمكن للمعلمين اختيارها عند التسجيل.
        </p>
      </div>
      <QiraatManager groups={groups} />
    </div>
  );
}
