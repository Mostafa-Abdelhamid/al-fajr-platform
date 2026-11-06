import { prisma } from "@/lib/prisma";
import { getLocale } from "@/i18n/getLocale";
import { makeT } from "@/i18n/t";
import { leaderboard } from "@/i18n/dictionaries/leaderboard";
import LeaderboardTabs from "@/components/LeaderboardTabs";

export default async function AdminLeaderboardPage() {
  const locale = await getLocale();
  const t = makeT(leaderboard, locale);

  const [students, teacherProfiles] = await Promise.all([
    prisma.user.findMany({
      where: { role: "STUDENT" },
      orderBy: { points: "desc" },
      take: 50,
      select: { id: true, name: true, avatarEmoji: true, points: true, streak: true },
    }),
    prisma.teacherProfile.findMany({
      orderBy: { points: "desc" },
      take: 50,
      include: { user: true },
    }),
  ]);

  const teachers = teacherProfiles.map((tp) => ({
    id: tp.id,
    name: tp.user.name,
    avatarEmoji: tp.user.avatarEmoji,
    points: tp.points,
    rating: tp.rating,
    ratingCount: tp.ratingCount,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-night">{t("pageTitle")}</h1>
        <p className="text-sm text-muted mt-1">{t("pageSubtitle")}</p>
      </div>

      <section className="hover-lift animate-fade-up bg-white rounded-2xl border border-gray-100 p-6">
        <LeaderboardTabs students={students} teachers={teachers} />
      </section>
    </div>
  );
}
