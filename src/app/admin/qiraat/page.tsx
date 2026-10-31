import { prisma } from "@/lib/prisma";
import QiraatManager from "@/components/QiraatManager";
import { getLocale } from "@/i18n/getLocale";
import { makeT } from "@/i18n/t";
import { admin } from "@/i18n/dictionaries/admin";

export default async function AdminQiraatPage() {
  const locale = await getLocale();
  const t = makeT(admin, locale);
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
        <h1 className="text-xl font-extrabold text-night">{t("qiraatPageTitle")}</h1>
        <p className="text-sm text-muted mt-1">{t("qiraatPageSubtitle")}</p>
      </div>
      <QiraatManager groups={groups} />
    </div>
  );
}
