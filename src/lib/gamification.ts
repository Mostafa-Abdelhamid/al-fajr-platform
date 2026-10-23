import { prisma } from "./prisma";

const POINTS_PER_SESSION = 20;

const BADGE_RULES: {
  type: string;
  label: string;
  icon: string;
  check: (stats: { completedCount: number; streak: number; points: number }) => boolean;
}[] = [
  {
    type: "first_session",
    label: "أول خطوة",
    icon: "🌱",
    check: (s) => s.completedCount >= 1,
  },
  {
    type: "five_sessions",
    label: "ملتزم",
    icon: "🔥",
    check: (s) => s.completedCount >= 5,
  },
  {
    type: "ten_sessions",
    label: "متفوق",
    icon: "⭐",
    check: (s) => s.completedCount >= 10,
  },
  {
    type: "streak_5",
    label: "مواظب",
    icon: "📿",
    check: (s) => s.streak >= 5,
  },
  {
    type: "points_100",
    label: "بطل الفجر",
    icon: "🏆",
    check: (s) => s.points >= 100,
  },
];

export async function rewardStudentForCompletedSession(studentId: string) {
  const student = await prisma.user.update({
    where: { id: studentId },
    data: {
      points: { increment: POINTS_PER_SESSION },
      streak: { increment: 1 },
    },
  });

  const completedCount = await prisma.session.count({
    where: { studentId, status: "COMPLETED" },
  });

  const existingBadges = await prisma.badge.findMany({
    where: { studentId },
    select: { type: true },
  });
  const earnedTypes = new Set(existingBadges.map((b) => b.type));

  const newlyEarned: { type: string; label: string; icon: string }[] = [];

  for (const rule of BADGE_RULES) {
    if (earnedTypes.has(rule.type)) continue;
    if (rule.check({ completedCount, streak: student.streak, points: student.points })) {
      newlyEarned.push(rule);
    }
  }

  if (newlyEarned.length > 0) {
    await prisma.badge.createMany({
      data: newlyEarned.map((b) => ({
        studentId,
        type: b.type,
        label: b.label,
        icon: b.icon,
      })),
    });
  }

  return { points: student.points, streak: student.streak, newlyEarned };
}

export const ALL_BADGE_RULES = BADGE_RULES;
