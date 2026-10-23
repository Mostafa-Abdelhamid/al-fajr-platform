import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AvailabilityManager from "@/components/AvailabilityManager";

export default async function AvailabilityPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const profile = await prisma.teacherProfile.findUnique({
    where: { userId: user.id },
    include: { availability: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-night">أوقات تواجدي</h1>
        <p className="text-muted mt-1">حدّد الأوقات الأسبوعية التي يمكن للطلاب حجز حصص معك خلالها.</p>
      </div>
      <AvailabilityManager initialSlots={profile?.availability || []} />
    </div>
  );
}
