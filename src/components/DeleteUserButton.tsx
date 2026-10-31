"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/i18n/LocaleProvider";
import { makeT } from "@/i18n/t";
import { admin } from "@/i18n/dictionaries/admin";

export default function DeleteUserButton({ userId, userName }: { userId: string; userName: string }) {
  const router = useRouter();
  const { locale } = useLocale();
  const t = makeT(admin, locale);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(t("confirmDeleteUser").replace("{name}", userName));
    if (!confirmed) return;

    setLoading(true);
    const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      window.alert(data.error || t("deleteUserFailed"));
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
      {loading ? t("deletingLabel") : t("deleteLabel")}
    </button>
  );
}
