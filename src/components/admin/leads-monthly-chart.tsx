import { getMonthlyLeadCounts } from "@/lib/utils/lead-stats";

export function LeadsMonthlyChart({
  leads,
  fill = false,
}: {
  leads: { created_at: string }[];
  fill?: boolean;
}) {
  const months = getMonthlyLeadCounts(leads, 6);
  const maxCount = Math.max(...months.map((month) => month.count), 1);

  return (
    <div className={`rounded-2xl bg-white p-5 ${fill ? "flex min-h-0 flex-1 flex-col" : ""}`}>
      <h2 className="mb-4 font-semibold text-neutral-900">Leads por mes</h2>

            <div className={`flex min-h-0 items-stretch gap-3 ${fill ? "flex-1" : ""}`}>
        {months.map((month, index) => {
          const isCurrent = index === months.length - 1;
          const heightPercent = Math.max((month.count / maxCount) * 100, 6);

          return (
            <div key={month.key} className="flex min-h-0 flex-1 flex-col items-center gap-1.5">
              <span className="text-xs text-neutral-500">{month.count}</span>
              <div className={`flex w-full items-end ${fill ? "h-full min-h-[64px]" : "h-24"}`}>
                <div
                  className={`w-full rounded-t-md ${
                    isCurrent ? "bg-[var(--color-primary)]" : "bg-[var(--color-primary)]/30"
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />
              </div>
              <span className="text-xs capitalize text-neutral-400">{month.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}