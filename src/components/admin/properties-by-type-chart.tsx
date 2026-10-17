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
      {/* Móvil: la leyenda baja bajo el título. Desktop: misma fila; si la
          tarjeta queda angosta, la leyenda baja sola en vez de desbordarse. */}
      <div className="mb-4 flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <h2 className="text-neutral-900">Propiedades por tipo</h2>

        <div className="flex items-center gap-3 text-xs text-neutral-500">
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="h-2 w-2 rounded-full bg-[var(--color-primary)]/40" />
            {venta} en venta
          </span>
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />
            {renta} en renta
          </span>
        </div>
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

              <div
                role="img"
                aria-label={`${item.venta} en venta, ${item.renta} en renta`}
                title={`${item.venta} en venta · ${item.renta} en renta`}
                className="h-1 w-full overflow-hidden rounded-full bg-gray-100"
              >
                {/* Barra clara: total del tipo (lo que queda visible es venta) */}
                <div
                  className="h-full overflow-hidden rounded-full bg-[var(--color-primary)]/40 transition-all duration-300"
                  style={{ width: `${Math.max((item.count / maxCount) * 100, 6)}%` }}
                >
                  {/* Barra sólida, dentro de la anterior: la parte en renta */}
                  <div
                    className="h-full rounded-full bg-[var(--color-primary)]"
                    style={{
                      width: `${(item.renta / item.count) * 100}%`,
                      minWidth: item.renta > 0 ? 4 : 0,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}