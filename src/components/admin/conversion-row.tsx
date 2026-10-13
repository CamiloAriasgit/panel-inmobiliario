import Image from "next/image";
import { formatConversionRate, type ConversionProperty } from "@/lib/utils/property-stats";
import { ConversionBars } from "./conversion-bars";

export function ConversionRow({
  property,
  referenceViews,
}: {
  property: ConversionProperty;
  referenceViews: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100">
        <Image src={property.image} alt="" fill className="object-cover" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <p className="line-clamp-1 text-sm text-neutral-900">{property.title}</p>
          <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-xs font-medium text-neutral-700">
            {formatConversionRate(property.conversionRate)} conv.
          </span>
        </div>

        <ConversionBars
          views={property.clickCount}
          leads={property.leadCount}
          referenceViews={referenceViews}
        />
      </div>
    </div>
  );
}