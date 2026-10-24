import { prisma } from "@/lib/prisma";
import { generateAvailableSlots } from "@/lib/slots";
import TeacherList from "@/components/TeacherList";

export default async function BookPage() {
  const teachers = await prisma.teacherProfile.findMany({
    include: { user: true, availability: true },
  });

  const teacherIds = teachers.map((t) => t.userId);
  const bookedSessions = await prisma.session.findMany({
    where: { teacherId: { in: teacherIds }, status: "SCHEDULED" },
    select: { teacherId: true, startAt: true },
  });

  const teacherData = teachers.map((t) => {
    const booked = bookedSessions
      .filter((b) => b.teacherId === t.userId)
      .map((b) => b.startAt);
    const slots = generateAvailableSlots(t.availability, booked).map((d) => d.toISOString());

    return {
      id: t.userId,
      name: t.user.name,
      avatarEmoji: t.user.avatarEmoji,
      qiraat: t.qiraat,
      bio: t.bio,
      yearsExperience: t.yearsExperience,
      rating: t.rating,
      ratingCount: t.ratingCount,
      slots,
    };
  });

  return (
    <div className="space-y-8">
      <div className="animate-fade-up">
        <h1 className="text-2xl font-extrabold text-night">احجز حصتك القادمة</h1>
        <p className="text-muted mt-1">اختر المعلم المناسب لك والقراءة التي تريد تعلمها.</p>
      </div>

      {teacherData.length === 0 ? (
        <p className="text-muted text-sm">لا يوجد معلمون مسجلون بعد.</p>
      ) : (
        <TeacherList teachers={teacherData} />
      )}
    </div>
  );
}
