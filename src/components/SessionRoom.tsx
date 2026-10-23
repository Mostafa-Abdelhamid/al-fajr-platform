"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type SessionData = {
  id: string;
  roomName: string;
  status: string;
  surahFocus: string;
  teacherNotes: string;
  rating: number | null;
  otherPartyName: string;
  otherPartyEmoji: string;
};

export default function SessionRoom({
  session,
  isTeacher,
  dashboardHref,
}: {
  session: SessionData;
  isTeacher: boolean;
  dashboardHref: string;
}) {
  const router = useRouter();
  const [showComplete, setShowComplete] = useState(false);
  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ newlyEarned: { icon: string; label: string }[] } | null>(
    null
  );

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
    }
  }

  const jitsiUrl = `https://meet.jit.si/${session.roomName}#config.prejoinPageEnabled=false&userInfo.displayName=%22${encodeURIComponent(
    session.otherPartyName
  )}%22`;

  return (
    <div className="flex-1 flex flex-col lg:flex-row gap-0 h-[calc(100vh-72px)]">
      <div className="flex-1 bg-black">
        {session.status === "COMPLETED" ? (
          <div className="h-full flex items-center justify-center text-white text-center p-8">
            <div>
              <p className="text-4xl mb-3">✅</p>
              <p className="text-lg font-bold">تم إنهاء هذه الحصة بالفعل</p>
              <p className="text-gray-400 text-sm mt-2">يمكنك مراجعة تفاصيلها من لوحتك.</p>
            </div>
          </div>
        ) : (
          <iframe
            src={jitsiUrl}
            allow="camera; microphone; fullscreen; display-capture; autoplay"
            className="w-full h-full border-0"
          />
        )}
      </div>

      <aside className="w-full lg:w-80 bg-cream p-6 overflow-y-auto">
        <Link href={dashboardHref} className="text-sm text-muted font-bold">
          ← العودة للوحتي
        </Link>

        <div className="mt-5 bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs text-muted font-bold mb-1">الحصة مع</p>
          <p className="font-extrabold text-night">
            {session.otherPartyEmoji} {session.otherPartyName}
          </p>
          {session.surahFocus && (
            <p className="text-sm text-dawn font-semibold mt-2">محور الحصة: {session.surahFocus}</p>
          )}
        </div>

        {isTeacher && session.status !== "COMPLETED" && (
          <div className="mt-5 bg-white rounded-2xl border border-gray-100 p-5">
            {!result ? (
              !showComplete ? (
                <button
                  onClick={() => setShowComplete(true)}
                  className="w-full bg-night text-white font-bold py-3 rounded-xl text-sm"
                >
                  إنهاء الحصة وتقييمها
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="font-bold text-sm text-night">ملاحظات للطالب</p>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full rounded-xl border-2 border-gray-200 px-3 py-2 text-sm focus:border-dawn focus:outline-none"
                    placeholder="مثال: أحسن في حفظ الآيات 1-10، يحتاج مراجعة المدود"
                  />
                  <p className="font-bold text-sm text-night">تقييم أداء الطالب</p>
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
                    {loading ? "جارٍ الحفظ..." : "حفظ وإنهاء الحصة"}
                  </button>
                </div>
              )
            ) : (
              <div className="text-center">
                <p className="font-extrabold text-green text-sm mb-2">✅ تم إنهاء الحصة بنجاح</p>
                {result.newlyEarned.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-muted mb-2">حصل الطالب على شارات جديدة:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {result.newlyEarned.map((b, i) => (
                        <span key={i} className="bg-orange-50 rounded-lg px-3 py-1 text-xs font-bold">
                          {b.icon} {b.label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <button
                  onClick={() => router.push(dashboardHref)}
                  className="mt-4 text-sm font-bold text-dawn"
                >
                  العودة للوحتي →
                </button>
              </div>
            )}
          </div>
        )}

        {!isTeacher && session.status === "COMPLETED" && session.teacherNotes && (
          <div className="mt-5 bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-xs text-muted font-bold mb-1">ملاحظة معلمك</p>
            <p className="text-sm">{session.teacherNotes}</p>
          </div>
        )}
      </aside>
    </div>
  );
}
