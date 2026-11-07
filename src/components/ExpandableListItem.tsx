"use client";

import { useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";

export default function ExpandableListItem({
  summary,
  details,
  className = "",
  style,
}: {
  summary: ReactNode;
  details: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const [expanded, setExpanded] = useState(false);

  function handleClick(e: MouseEvent<HTMLLIElement>) {
    if ((e.target as HTMLElement).closest("a, button, input, textarea, select")) return;
    setExpanded((v) => !v);
  }

  return (
    <li onClick={handleClick} className={`relative pe-8 ${className}`} style={style}>
      {summary}
      <span
        aria-hidden="true"
        className={`absolute top-1/2 end-3 -translate-y-1/2 text-muted text-sm transition-transform duration-300 ${
          expanded ? "rotate-180" : ""
        }`}
      >
        ▾
      </span>
      {expanded && (
        <div className="w-full basis-full mt-3 pt-3 border-t border-gray-200/70 animate-scale-in text-xs text-muted space-y-1.5">
          {details}
        </div>
      )}
    </li>
  );
}
