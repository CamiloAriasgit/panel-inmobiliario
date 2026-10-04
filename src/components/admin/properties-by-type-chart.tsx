import { getPropertyTypeBreakdown, getListingTypeCounts } from "@/lib/utils/property-stats";

export function PropertiesByTypeChart({
  properties,
  fill = false,
}: {
  properties: { property_type: string; listing_type: string }[];
  fill?: boolean;
}) {
  const breakdown = getPropertyTypeBreakdown(properties);
  const { venta, renta } = getListingTypeCounts(properties);
  const maxCount = Math.max(...breakdown.map((item) => item.count), 1);

  return (
    <div className={`rounded-2xl bg-white p-5 ${fill ? "flex min-h-0 flex-1 flex-col" : ""}`}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-neutral-900">Propiedades por tipo</h2>
        <p className="text-xs text-neutral-400">
          {venta} en venta · {renta} en renta
        </p>
      </div>

      {breakdown.length === 0 ? (
        <p className="text-sm text-neutral-500">Aún no hay propiedades.</p>
      ) : (
        <div className={`flex flex-col justify-center gap-3 ${fill ? "min-h-0 flex-1" : ""}`}>
          {breakdown.map((item) => (
            <div key={item.type} className="flex items-center gap-3">
              <span className="w-28 shrink-0 text-sm text-neutral-600">{item.label}</span>
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-[var(--color-primary)]"
                  style={{ width: `${Math.max((item.count / maxCount) * 100, 6)}%` }}
                />
              </div>
              <span className="w-5 shrink-0 text-right text-sm text-neutral-500">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}