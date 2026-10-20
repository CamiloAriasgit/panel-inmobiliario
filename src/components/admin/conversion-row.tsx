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
            <div className="min-w-0 flex-1 bg-gray-200 rounded-2xl flex flex-col overflow-hidden">
                <div className="relative w-full h-50">
                    <Image src={property.image} alt="" fill className="object-cover" />
                    <span className="absolute bottom-2 left-2 shrink-0 rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-neutral-700">
                        {formatConversionRate(property.conversionRate)} conv.
                    </span>
                </div>
                <div className="flex flex-col gap-3 p-4 pb-5">
                    <div>
                        <p className="line-clamp-1 text-sm text-neutral-900">{property.title}</p>
                    </div>

                    <ConversionBars
                        views={property.clickCount}
                        leads={property.leadCount}
                        referenceViews={referenceViews}
                    />
                </div>
            </div>
        </div>
    );
}