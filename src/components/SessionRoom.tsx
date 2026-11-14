"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import { makeT } from "@/i18n/t";
import { session as sessionDict } from "@/i18n/dictionaries/session";
import { badgeLabel } from "@/i18n/dictionaries/badges";
import RateTeacherForm from "./RateTeacherForm";
import LoadingDots from "./LoadingDots";
import { useToast } from "./ToastProvider";

type SessionData = {
  id: string;
  roomName: string;
  status: string;
  surahFocus: string;
  teacherNotes: string;
  rating: number | null;
  studentRating: number | null;
  otherPartyName: string;
  otherPartyEmoji: string;
};

export default function SessionRoom({
  session,
  isTeacher,
  dashboardHref,
  videoToken,
}: {
  session: SessionData;
  isTeacher: boolean;
  dashboardHref: string;
  videoToken: string | null;
}) {
  const router = useRouter();
  const { locale } = useLocale();
  const t = makeT(sessionDict, locale);
  const { showToast } = useToast();
  const [showComplete, setShowComplete] = useState(false);
  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ newlyEarned: { icon: string; label: string; type: string }[] } | null>(
    null
  );
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fallbackFullscreen, setFallbackFullscreen] = useState(false);

  useEffect(() => {
    function handleChange() {
      setIsFullscreen(!!document.fullscreenElement);
    }
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  async function toggleFullscreen() {
    const el = videoContainerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen().catch(() => {});
      setFallbackFullscreen(false);
      return;
    }
    if (el.requestFullscreen) {
      try {
        await el.requestFullscreen();
        return;
      } catch {
        // Some browsers (older iOS Safari) reject requestFullscreen on
        // arbitrary elements — fall back to a full-viewport overlay below.
      }
    }
    setFallbackFullscreen((v) => !v);
  }

  async function handleComplete() {
    setLoading(true);
    const res = await fetch(`/api/sessions/${session.id}/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teacherNotes: notes, rating }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setResult(data.reward);
      showToast(t("completedSuccess"), "success");
    } else {
      showToast(data.error || t("completeFailed"), "error");
    }
  }

  // New sessions get a real Daily.co room (full URL, e.g. "https://team.daily.co/room").
  // Sessions booked before Daily.co was wired up stored a bare room name for Jitsi —
  // keep those working by falling back to meet.jit.si for them.
  const isDailyRoom = session.roomName.startsWith("http");
  const videoUrl = isDailyRoom
    ? videoToken
      ? `${session.roomName}?t=${videoToken}`
      : session.roomName
    : `https://meet.jit.si/${session.roomName}#config.prejoinPageEnabled=false&userInfo.displayName=%22${encodeURIComponent(
        session.otherPartyName
      )}%22`;

  return (
    <div className="flex-1 flex flex-col lg:flex-row gap-0 lg:h-[calc(100vh-72px)]">
      <div
        ref={videoContainerRef}
        className={`relative bg-black ${
          fallbackFullscreen
            ? "fixed inset-0 z-[100]"
            : "h-[55vh] min-h-[320px] shrink-0 lg:h-auto lg:min-h-0 lg:flex-1"
        }`}
      >
        {session.status === "COMPLETED" ? (
          <div className="h-full flex items-center justify-center text-white text-center p-8">
            <div>
              <p className="text-4xl mb-3">✅</p>
              <p className="text-lg font-bold">{t("alreadyCompleted")}</p>
              <p className="text-gray-400 text-sm mt-2">{t("reviewFromDashboard")}</p>
            </div>
          </div>
        ) : (
          <>
            <iframe
              src={videoUrl}
              allow="camera; microphone; fullscreen; display-capture; autoplay"
              allowFullScreen
              className="w-full h-full border-0"
            />
            <button
              onClick={toggleFullscreen}
              title={isFullscreen || fallbackFullscreen ? t("exitFullscreen") : t("enterFullscreen")}
              aria-label={isFullscreen || fallbackFullscreen ? t("exitFullscreen") : t("enterFullscreen")}
              className="absolute bottom-3 end-3 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center text-lg transition"
            >
              {isFullscreen || fallbackFullscreen ? "⤡" : "⛶"}
            </button>
          </>
        )}
      </div>

      <aside className="w-full lg:w-80 bg-cream p-6 lg:overflow-y-auto">
        <Link href={dashboardHref} className="text-sm text-muted font-bold">
          {t("backToDashboard")}
        </Link>

        <div className="mt-5 bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs text-muted font-bold mb-1">{t("sessionWith")}</p>
          <p className="font-extrabold text-night">
            {session.otherPartyEmoji} {session.otherPartyName}
          </p>
          {session.surahFocus && (
            <p className="text-sm text-dawn font-semibold mt-2">
              {t("sessionFocus")}: {session.surahFocus}
            </p>
          )}
        </div>

        {isTeacher && session.status !== "COMPLETED" && (
          <div className="mt-5 bg-amber-50 border border-amber-100 rounded-2xl p-4">
            <p className="text-xs text-dawn font-semibold">💡 {t("muteStudentHint")}</p>
          </div>
        )}

        {!isTeacher && session.status === "COMPLETED" && (
          <div className="mt-5">
            <RateTeacherForm
              sessionId={session.id}
              teacherName={session.otherPartyName}
              initialStudentRating={session.studentRating}
            />
          </div>
        )}

        {isTeacher && session.status !== "COMPLETED" && (
          <div className="mt-5 bg-white rounded-2xl border border-gray-100 p-5">
            {!result ? (
              !showComplete ? (
                <button
                  onClick={() => setShowComplete(true)}
                  className="w-full bg-night text-white font-bold py-3 rounded-xl text-sm"
                >
                  {t("endSessionAndRate")}
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="font-bold text-sm text-night">{t("notesForStudent")}</p>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full rounded-xl border-2 border-gray-200 px-3 py-2 text-sm focus:border-dawn focus:outline-none"
                    placeholder={t("notesPlaceholder")}
                  />
                  <p className="font-bold text-sm text-night">{t("rateStudentPerformance")}</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        onClick={() => setRating(n)}
                        className={`text-2xl ${n <= rating ? "text-gold" : "text-gray-300"}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleComplete}
                    disabled={loading}
                    className="w-full bg-gradient-to-l from-dawn to-gold text-white font-bold py-3 rounded-xl text-sm disabled:opacity-60"
                  >
                    {loading ? (
                      <span className="inline-flex items-center gap-2">
                        {t("saving")}
                        <LoadingDots />
                      </span>
                    ) : (
                      t("saveAndEnd")
                    )}
                  </button>
                </div>
              )
            ) : (
              <div className="text-center">
                <p className="font-extrabold text-green text-sm mb-2">{t("completedSuccess")}</p>
                {result.newlyEarned.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-muted mb-2">{t("studentEarnedBadges")}</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {result.newlyEarned.map((b, i) => (
                        <span key={i} className="bg-amber-50 rounded-lg px-3 py-1 text-xs font-bold">
                          {b.icon} {badgeLabel(b.type, locale)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <button
                  onClick={() => router.push(dashboardHref)}
                  className="mt-4 text-sm font-bold text-dawn"
                >
                  {t("backToDashboardArrow")}
                </button>
              </div>
            )}
          </div>
        )}

        {!isTeacher && session.status === "COMPLETED" && session.teacherNotes && (
          <div className="mt-5 bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-xs text-muted font-bold mb-1">{t("teacherNoteLabel")}</p>
            <p className="text-sm">{session.teacherNotes}</p>
          </div>
        )}
      </aside>
    </div>
  );
}
