import { prisma } from "./prisma";

const POINTS_PER_SESSION = 20;
const TEACHER_BASE_POINTS_PER_SESSION = 15;

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

// Session-count milestones that automatically earn a student a certificate.
// Checked against the student's total COMPLETED session count after each
// completion; a milestone is only ever issued once (guarded by sessionsAtIssue).
const CERTIFICATE_MILESTONES = [10, 25, 50, 100];

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

  let newCertificate: { id: string; sessionsAtIssue: number | null } | null = null;
  if (CERTIFICATE_MILESTONES.includes(completedCount)) {
    const existing = await prisma.certificate.findFirst({
      where: { studentId, type: "MILESTONE", sessionsAtIssue: completedCount },
    });
    if (!existing) {
      newCertificate = await prisma.certificate.create({
        data: {
          studentId,
          type: "MILESTONE",
          title: `شهادة إتمام ${completedCount} حصة`,
          sessionsAtIssue: completedCount,
        },
      });
    }
  }

  return { points: student.points, streak: student.streak, newlyEarned, newCertificate };
}

export async function awardTeacherBaseSessionPoints(teacherId: string) {
  const profile = await prisma.teacherProfile.update({
    where: { userId: teacherId },
    data: { points: { increment: TEACHER_BASE_POINTS_PER_SESSION } },
  });
  return { points: profile.points };
}

// Called once a student rates the teacher for a specific session (separate
// from the teacher's own rating of the student). Awards a points bonus
// proportional to the rating and folds it into the teacher's public
// rating/ratingCount — the one genuine source of a teacher's displayed rating.
export async function rewardTeacherForStudentRating(teacherId: string, studentRating: number) {
  const profile = await prisma.teacherProfile.findUnique({ where: { userId: teacherId } });
  if (!profile) return null;

  const newRatingCount = profile.ratingCount + 1;
  const newRating = (profile.rating * profile.ratingCount + studentRating) / newRatingCount;
  const bonus = studentRating * 2;

  const updated = await prisma.teacherProfile.update({
    where: { userId: teacherId },
    data: {
      points: { increment: bonus },
      rating: newRating,
      ratingCount: newRatingCount,
    },
  });
  return { points: updated.points, rating: updated.rating, ratingCount: updated.ratingCount };
}

export const ALL_BADGE_RULES = BADGE_RULES;
