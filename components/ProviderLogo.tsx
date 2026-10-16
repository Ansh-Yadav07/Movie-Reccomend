import { IMG } from "@/lib/constants";
import type { Provider } from "@/lib/types";

const COLORS = ["bg-rose-600", "bg-sky-600", "bg-emerald-600", "bg-amber-600", "bg-violet-600", "bg-teal-600", "bg-fuchsia-600"];

export function ProviderLogo({ provider, size = 40 }: { provider: Provider; size?: number }) {
  const src = IMG(provider.logo_path, "w92");
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={provider.provider_name} width={size} height={size} className="rounded-lg shrink-0" style={{ width: size, height: size }} />;
  }
  const initials = provider.provider_name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <span
      className={`${COLORS[provider.provider_id % COLORS.length]} grid shrink-0 place-items-center rounded-lg font-bold text-white`}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      aria-label={provider.provider_name}
    >
      {initials}
    </span>
  );
}
