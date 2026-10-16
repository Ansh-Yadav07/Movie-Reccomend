import { IMG } from "@/lib/constants";

const GRADIENTS = [
  "from-rose-700 to-orange-500", "from-indigo-700 to-sky-500", "from-emerald-700 to-teal-400",
  "from-fuchsia-700 to-pink-500", "from-amber-700 to-yellow-500", "from-violet-800 to-indigo-500",
];

export function Poster({ path, title, id, size = "w342", className = "" }: { path: string | null; title: string; id: number; size?: string; className?: string }) {
  const src = IMG(path, size);
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={title} loading="lazy" className={`aspect-[2/3] w-full object-cover ${className}`} />;
  }
  return (
    <div className={`grid aspect-[2/3] w-full place-items-center bg-gradient-to-br p-3 text-center ${GRADIENTS[id % GRADIENTS.length]} ${className}`}>
      <span className="text-base font-bold leading-tight text-white drop-shadow">{title}</span>
    </div>
  );
}
