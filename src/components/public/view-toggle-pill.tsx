import Link from "next/link";
import { List, Map as MapIcon } from "lucide-react";

export type QueryParams = Record<string, string | undefined>;

function buildViewHref(params: QueryParams, view: "list" | "map") {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (key === "view" || !value) return;
    usp.set(key, value);
  });
  usp.set("view", view);
  return `?${usp.toString()}`;
}

export function ViewTogglePill({
  view,
  params,
}: {
  view: "list" | "map";
  params: QueryParams;
}) {
  return (
    <div
      className="inline-flex rounded-full border border-neutral-700
                 bg-black/70 p-1 shadow-lg backdrop-blur-md lg:bg-white lg:border-gray-300 lg:shadow-none"
    >
      <ViewToggleLink href={buildViewHref(params, "list")} view="list" currentView={view} icon={List} label="Lista" />
      <ViewToggleLink href={buildViewHref(params, "map")} view="map" currentView={view} icon={MapIcon} label="Mapa" />
    </div>
  );
}

function ViewToggleLink({
  href,
  view,
  currentView,
  icon: Icon,
  label,
}: {
  href: string;
  view: "list" | "map";
  currentView: "list" | "map";
  icon: typeof List;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm ${
        currentView === view
          ? "bg-white text-black lg:bg-gray-200"
          : "text-neutral-300 lg:text-neutral-900"
      }`}
    >
      <Icon size={16} />
      {label}
    </Link>
  );
}