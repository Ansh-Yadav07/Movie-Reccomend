import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-24 text-center">
      <h1 className="text-3xl font-black">Nothing playing here</h1>
      <p className="mt-2 text-zinc-400">We couldn&apos;t find that page or movie.</p>
      <Link href="/discover" className="mt-6 inline-block rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold">Browse movies</Link>
    </div>
  );
}
