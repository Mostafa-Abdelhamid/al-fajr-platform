"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type QiraatGroup = { reciter: string; riwayat: { id: string; riwaya: string }[] };

export default function QiraatManager({ groups }: { groups: QiraatGroup[] }) {
  const router = useRouter();
  const [reciter, setReciter] = useState("");
  const [riwaya, setRiwaya] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const existingReciters = Array.from(new Set(groups.map((g) => g.reciter)));

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/admin/qiraat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reciter, riwaya }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "تعذرت إضافة الرواية");
      return;
    }
    setReciter("");
    setRiwaya("");
    router.refresh();
  }

  async function handleDelete(id: string, riwaya: string) {
    const confirmed = window.confirm(`هل تريد حذف رواية "${riwaya}" من قائمة القراءات؟`);
    if (!confirmed) return;

    setDeletingId(id);
    const res = await fetch(`/api/admin/qiraat/${id}`, { method: "DELETE" });
    setDeletingId(null);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      window.alert(data.error || "تعذر حذف الرواية");
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <section className="hover-lift animate-fade-up bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-extrabold text-night mb-4">إضافة رواية جديدة</h3>
        <form onSubmit={handleAdd} className="grid sm:grid-cols-[1fr_1fr_auto] gap-3 items-start">
          <div>
            <input
              required
              list="reciters-list"
              value={reciter}
              onChange={(e) => setReciter(e.target.value)}
              placeholder="اسم القارئ (مثال: عاصم الكوفي)"
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:border-dawn focus:ring-4 focus:ring-dawn/10 focus:outline-none transition-shadow"
            />
            <datalist id="reciters-list">
              {existingReciters.map((r) => (
                <option key={r} value={r} />
              ))}
            </datalist>
          </div>
          <input
            required
            value={riwaya}
            onChange={(e) => setRiwaya(e.target.value)}
            placeholder="اسم الرواية (مثال: حفص عن عاصم)"
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:border-dawn focus:ring-4 focus:ring-dawn/10 focus:outline-none transition-shadow"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-gradient-to-l from-dawn to-gold text-white font-bold px-6 py-3 text-sm shadow-lg shadow-orange-300/40 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:translate-y-0"
          >
            {loading ? "جارٍ الإضافة..." : "+ إضافة"}
          </button>
        </form>
        {error && (
          <p className="text-sm text-red-600 font-semibold bg-red-50 rounded-xl px-4 py-3 mt-3 animate-fade-in">
            {error}
          </p>
        )}
      </section>

      <section className="hover-lift animate-fade-up bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-extrabold text-night mb-4">القراءات الحالية</h3>
        {groups.length === 0 ? (
          <p className="text-sm text-muted">لا توجد قراءات بعد.</p>
        ) : (
          <div className="space-y-4">
            {groups.map((group) => (
              <div key={group.reciter}>
                <p className="text-xs font-bold text-muted mb-2">{group.reciter}</p>
                <div className="flex flex-wrap gap-2">
                  {group.riwayat.map((r, i) => (
                    <span
                      key={r.id}
                      style={{ animationDelay: `${Math.min(i * 0.04, 0.3)}s` }}
                      className="animate-scale-in flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-xl border-2 border-gray-200 bg-gray-50 shadow-sm text-night hover:border-dawn/40 hover:bg-orange-50 hover:shadow-md transition-all"
                    >
                      {r.riwaya}
                      <button
                        onClick={() => handleDelete(r.id, r.riwaya)}
                        disabled={deletingId === r.id}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50"
                        title="حذف"
                      >
                        {deletingId === r.id ? "…" : "✕"}
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
