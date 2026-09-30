"use client";

import { useLayoutEffect, useRef, useState } from "react";

export function LeadsSplitView({
  tab,
  leadsColumn,
  statsColumn,
}: {
  tab: "list" | "stats";
  leadsColumn: React.ReactNode;
  statsColumn: React.ReactNode;
}) {
  const leadsRef = useRef<HTMLDivElement>(null);
  const [matchedHeight, setMatchedHeight] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = leadsRef.current;
    if (!el) return;

    function updateHeight() {
      setMatchedHeight(el!.offsetHeight);
    }

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-stretch">
      <div className={tab === "list" ? "block" : "hidden lg:block"}>
        <div
          ref={leadsRef}
          className="max-h-[70vh] overflow-y-auto pr-1 scrollbar-hide lg:h-full"
        >
          {leadsColumn}
        </div>
      </div>

      <div
        className={`${tab === "stats" ? "flex" : "hidden lg:flex"} flex-col gap-6`}
        style={matchedHeight ? { minHeight: matchedHeight } : undefined}
      >
        {statsColumn}
      </div>
    </div>
  );
}