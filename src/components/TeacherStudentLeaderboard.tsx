import { prisma } from "@/lib/prisma";
import { getLocale } from "@/i18n/getLocale";
import { makeT } from "@/i18n/t";
import { leaderboard } from "@/i18n/dictionaries/leaderboard";

const MEDAL = ["🥇", "🥈", "🥉"];
const RANK_COLOR = ["text-amber-500", "text-gray-400", "text-amber-700"];

export default async function TeacherStudentLeaderboard({ teacherId }: { teacherId: string }) {
  const locale = await getLocale();
  const t = makeT(leaderboard, locale);

  const linkedSessions = await prisma.session.findMany({
    where: { teacherId },
    select: { studentId: true },
    distinct: ["studentId"],
  });
  const studentIds = linkedSessions.map((s) => s.studentId);

  const students = studentIds.length
    ? await prisma.user.findMany({
        where: { id: { in: studentIds }, role: "STUDENT" },
        orderBy: { points: "desc" },
        select: { id: true, name: true, avatarEmoji: true, points: true, streak: true },
      })
    : [];

  return (
    <section className="hover-lift animate-fade-up bg-white rounded-2xl border border-gray-100 p-6">
      <div className="mb-4">
        <h3 className="font-extrabold text-night">{t("myStudentsLeaderboardTitle")}</h3>
        <p className="text-xs text-muted mt-0.5">{t("myStudentsLeaderboardSubtitle")}</p>
      </div>
      {students.length === 0 ? (
        <p className="text-sm text-muted">{t("noLinkedStudentsYet")}</p>
      ) : (
        <ul className="space-y-3">
          {students.map((s, i) => (
            <li
              key={s.id}
              style={{ animationDelay: `${Math.min(i * 0.05, 0.4)}s` }}
              className="animate-fade-up rounded-2xl border border-gray-200 bg-gray-50 shadow-sm p-3 flex items-center justify-between flex-wrap gap-3 hover:bg-blue-50 hover:border-blue-300 hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className={`w-7 text-center font-extrabold ${i < 3 ? RANK_COLOR[i] : "text-muted"}`}>
                  {i < 3 ? MEDAL[i] : i + 1}
                </span>
                <span className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-base shrink-0">
                  {s.avatarEmoji}
                </span>
                <p className="font-semibold text-sm">{s.name}</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold">
                <span className="text-gold bg-amber-50 rounded-full px-3 py-1.5">
                  ⭐ {s.points} {t("pointsLabel")}
                </span>
                <span className="text-rose-500 bg-rose-50 rounded-full px-3 py-1.5">
                  🔥 {s.streak} {t("streakLabel")}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
