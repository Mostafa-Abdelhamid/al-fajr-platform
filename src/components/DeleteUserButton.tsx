"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteUserButton({ userId, userName }: { userId: string; userName: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `هل أنت متأكد من حذف "${userName}"؟ سيتم حذف كل بياناته (الحصص، التقدم، الشارات) نهائيًا ولا يمكن التراجع عن هذا الإجراء.`
    );
    if (!confirmed) return;

    setLoading(true);
    const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      window.alert(data.error || "تعذر حذف المستخدم");
      return;
    }
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-xs font-bold text-red-600 hover:bg-red-50 px-3 py-2 rounded-full transition disabled:opacity-50"
    >
      {loading ? "جارٍ الحذف..." : "🗑️ حذف"}
    </button>
  );
}
