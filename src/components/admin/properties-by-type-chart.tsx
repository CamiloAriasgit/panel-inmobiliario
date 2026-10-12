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
    <div className={`rounded-2xl bg-gray-200 p-5 ${fill ? "flex min-h-0 flex-1 flex-col" : ""}`}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-neutral-900">Propiedades por tipo</h2>
        <p className="text-xs text-neutral-400">
          {venta} en venta · {renta} en renta
        </p>
      </div>

      {breakdown.length === 0 ? (
        <p className="text-sm text-neutral-500">Aún no hay propiedades.</p>
      ) : (
        <div className={`flex flex-col justify-center gap-4 ${fill ? "min-h-0 flex-1 overflow-y-auto" : ""}`}>
          {breakdown.map((item) => (
            <div key={item.type} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-700">
                  {item.label}
                </span>
                <span className="text-sm text-neutral-500">
                  {item.count}
                </span>
              </div>

              <div className="h-1 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-300"
                  style={{ width: `${Math.max((item.count / maxCount) * 100, 6)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}