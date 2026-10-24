"use client";

import { QIRAAT_GROUPS } from "@/lib/qiraat";

export default function QiraatMultiSelect({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  function toggle(riwaya: string) {
    if (value.includes(riwaya)) {
      onChange(value.filter((v) => v !== riwaya));
    } else {
      onChange([...value, riwaya]);
    }
  }

  return (
    <div className="rounded-xl border-2 border-gray-200 p-3 max-h-56 overflow-y-auto space-y-3">
      {QIRAAT_GROUPS.map((group) => (
        <div key={group.reciter}>
          <p className="text-xs font-bold text-muted mb-1.5">{group.reciter}</p>
          <div className="flex flex-wrap gap-2">
            {group.riwayat.map((r) => {
              const selected = value.includes(r);
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => toggle(r)}
                  className={`text-xs font-bold px-3 py-2 rounded-xl border-2 transition ${
                    selected
                      ? "border-dawn bg-orange-50 text-dawn"
                      : "border-gray-200 text-muted hover:border-gray-300"
                  }`}
                >
                  {selected && "✓ "}
                  {r}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
