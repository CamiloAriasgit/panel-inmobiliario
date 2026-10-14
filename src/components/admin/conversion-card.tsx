import type { ConversionProperty } from "@/lib/utils/property-stats";
import { ConversionLegend } from "./conversion-legend";
import { ConversionRow } from "./conversion-row";

export function ConversionCard({
    title,
    subtitle,
    properties,
    referenceViews,
}: {
    title: string;
    subtitle: string;
    properties: ConversionProperty[];
    referenceViews: number;
}) {
    if (properties.length === 0) return null;

    return (
        <div className="">
            <div className="mb-4 flex gap-2 sm:flex-row sm:flex-wrap justify-between">
                <div>
                    <h2 className="text-neutral-900">{title}</h2>
                    <p className="text-xs text-neutral-500">{subtitle}</p>
                </div>
                <ConversionLegend />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {properties.map((property) => (
                    <ConversionRow
                        key={property.id}
                        property={property}
                        referenceViews={referenceViews}
                    />
                ))}
            </div>
        </div>
    );
}