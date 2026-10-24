"use client";

import { useState } from "react";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("كلمة المرور الجديدة وتأكيدها غير متطابقين");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/account/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "حدث خطأ ما");
        setLoading(false);
        return;
      }
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setError("تعذر الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md animate-fade-up">
      <h1 className="text-2xl font-extrabold text-night mb-1">تغيير كلمة المرور</h1>
      <p className="text-muted mb-6 text-sm">حدّث كلمة مرور حسابك للحفاظ على أمانه.</p>

      <form onSubmit={handleSubmit} className="hover-lift bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div>
          <label className="block text-sm font-bold text-night mb-1">كلمة المرور الحالية</label>
          <input
            required
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:border-dawn focus:ring-4 focus:ring-dawn/10 focus:outline-none transition-shadow"
            placeholder="••••••••"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-night mb-1">كلمة المرور الجديدة</label>
          <input
            required
            type="password"
            minLength={6}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:border-dawn focus:ring-4 focus:ring-dawn/10 focus:outline-none transition-shadow"
            placeholder="6 أحرف على الأقل"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-night mb-1">تأكيد كلمة المرور الجديدة</label>
          <input
            required
            type="password"
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:border-dawn focus:ring-4 focus:ring-dawn/10 focus:outline-none transition-shadow"
            placeholder="أعد كتابة كلمة المرور الجديدة"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 font-semibold bg-red-50 rounded-xl px-4 py-3 animate-fade-in">
            {error}
          </p>
        )}
        {success && (
          <p className="text-sm text-green font-semibold bg-green-50 rounded-xl px-4 py-3 animate-fade-in">
            ✅ تم تغيير كلمة المرور بنجاح.
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-l from-dawn to-gold text-white font-bold py-3.5 shadow-lg shadow-orange-300/40 hover:-translate-y-0.5 hover:shadow-xl transition-all disabled:opacity-60 disabled:translate-y-0"
        >
          {loading ? "جارٍ الحفظ..." : "حفظ كلمة المرور الجديدة"}
        </button>
      </form>
    </div>
  );
}
