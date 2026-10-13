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


            <div className="min-w-0 flex-1 bg-whit">
                <div className="flex items-center gap-2">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-sm bg-gray-100">
                        <Image src={property.image} alt="" fill className="object-cover" />
                    </div>
                    <div>
                        <p className="line-clamp-1 text-sm text-neutral-900">{property.title}</p>
                        <span className="shrink-0 rounded-full bg-gray-100/80 px-2 py-0.5 text-xs font-medium text-neutral-700">
                            {formatConversionRate(property.conversionRate)} conv.
                        </span>
                    </div>
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