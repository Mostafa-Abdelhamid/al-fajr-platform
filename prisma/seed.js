const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

function hoursFromNow(hours) {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}

async function main() {
  console.log("🧹 تنظيف البيانات القديمة...");
  await prisma.badge.deleteMany();
  await prisma.progress.deleteMany();
  await prisma.session.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.teacherProfile.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash("123456", 10);

  console.log("👨‍🏫 إنشاء المعلمين...");
  const teacher1 = await prisma.user.create({
    data: {
      name: "الشيخ محمد العتيبي",
      email: "teacher@fajr.app",
      password,
      role: "TEACHER",
      avatarEmoji: "👨‍🏫",
      teacherProfile: {
        create: {
          qiraat: "حفص عن عاصم",
          bio: "حافظ للقرآن الكريم ومجاز بالسند المتصل، خبرة 12 سنة في تعليم الأطفال والكبار.",
          yearsExperience: 12,
          rating: 4.8,
          ratingCount: 34,
          isVerified: true,
          availability: {
            create: [0, 1, 2, 3, 4, 5, 6].map((d) => ({
              dayOfWeek: d,
              startTime: "16:00",
              endTime: "22:00",
            })),
          },
        },
      },
    },
    include: { teacherProfile: true },
  });

  const teacher2 = await prisma.user.create({
    data: {
      name: "الأستاذة سارة الحربي",
      email: "sara.teacher@fajr.app",
      password,
      role: "TEACHER",
      avatarEmoji: "👩‍🏫",
      teacherProfile: {
        create: {
          qiraat: "ورش عن نافع",
          bio: "معلمة قرآن متخصصة في قراءة ورش، إجازة بالسند، تحب تعليم الأطفال بأسلوب تفاعلي.",
          yearsExperience: 7,
          rating: 4.9,
          ratingCount: 21,
          isVerified: false,
          availability: {
            create: [0, 2, 4].map((d) => ({
              dayOfWeek: d,
              startTime: "10:00",
              endTime: "14:00",
            })),
          },
        },
      },
    },
    include: { teacherProfile: true },
  });

  console.log("🛡️ إنشاء حساب المدير...");
  await prisma.user.create({
    data: {
      name: "مدير المنصة",
      email: "admin@fajr.app",
      password,
      role: "ADMIN",
      avatarEmoji: "🛡️",
    },
  });

  console.log("🧑‍🎓 إنشاء الطلاب...");
  const student = await prisma.user.create({
    data: {
      name: "أحمد الفجر",
      email: "student@fajr.app",
      password,
      role: "STUDENT",
      avatarEmoji: "🧑‍🎓",
      points: 20,
      streak: 1,
    },
  });

  const student2 = await prisma.user.create({
    data: {
      name: "ليان عبدالله",
      email: "layan@fajr.app",
      password,
      role: "STUDENT",
      avatarEmoji: "👧",
      points: 0,
      streak: 0,
    },
  });

  console.log("📅 إنشاء الحصص...");
  await prisma.session.create({
    data: {
      studentId: student.id,
      teacherId: teacher1.id,
      startAt: hoursFromNow(26),
      endAt: hoursFromNow(27),
      status: "SCHEDULED",
      roomName: `fajr-demo-upcoming-${student.id}`,
      surahFocus: "سورة البقرة: من آية 1 إلى 20",
    },
  });

  await prisma.session.create({
    data: {
      studentId: student.id,
      teacherId: teacher1.id,
      startAt: hoursFromNow(-72),
      endAt: hoursFromNow(-71),
      status: "COMPLETED",
      roomName: `fajr-demo-completed-${student.id}`,
      surahFocus: "سورة الفاتحة",
      teacherNotes: "أحسنت في الحفظ والتجويد، ركّز أكثر على أحكام المدّ في المرة القادمة.",
      rating: 5,
    },
  });

  await prisma.session.create({
    data: {
      studentId: student2.id,
      teacherId: teacher2.id,
      startAt: hoursFromNow(50),
      endAt: hoursFromNow(51),
      status: "SCHEDULED",
      roomName: `fajr-demo-upcoming-${student2.id}`,
      surahFocus: "تأسيس قراءة ورش",
    },
  });

  console.log("📈 إنشاء بيانات التقدم والشارات...");
  await prisma.progress.createMany({
    data: [
      { studentId: student.id, surah: "الفاتحة", status: "مكتمل" },
      { studentId: student.id, surah: "البقرة", status: "قيد الحفظ" },
      { studentId: student.id, surah: "يس", status: "مراجعة" },
    ],
  });

  await prisma.badge.create({
    data: {
      studentId: student.id,
      type: "first_session",
      label: "أول خطوة",
      icon: "🌱",
    },
  });

  console.log("✅ تم إدخال بيانات تجريبية بنجاح!");
  console.log("—".repeat(40));
  console.log("حسابات تجريبية جاهزة:");
  console.log("  طالب:  student@fajr.app / 123456");
  console.log("  معلم:  teacher@fajr.app / 123456");
  console.log("  مدير:  admin@fajr.app / 123456");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
