import type { LucideIcon } from "lucide-react";

export function StatTile({
  icon: Icon,
  label,
  value,
  className = "",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl bg-gray-200 p-5 ${className}`}>
      <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-white text-neutral-700">
        <Icon size={16} />
      </div>
      <p className="text-3xl text-neutral-900">{value}</p>
      <p className="text-sm text-neutral-500">{label}</p>
    </div>
  );
}