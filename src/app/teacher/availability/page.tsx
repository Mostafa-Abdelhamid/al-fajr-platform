import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getLocale } from "@/i18n/getLocale";
import { makeT } from "@/i18n/t";
import { teacher as teacherDict } from "@/i18n/dictionaries/teacher";
import AvailabilityManager from "@/components/AvailabilityManager";

export default async function AvailabilityPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const locale = await getLocale();
  const t = makeT(teacherDict, locale);

  const profile = await prisma.teacherProfile.findUnique({
    where: { userId: user.id },
    include: { availability: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-night">{t("availabilityPageTitle")}</h1>
        <p className="text-muted mt-1">{t("availabilityPageSubtitle")}</p>
      </div>
      <AvailabilityManager initialSlots={profile?.availability || []} />
    </div>
  );
}
