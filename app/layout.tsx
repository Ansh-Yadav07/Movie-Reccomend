import type { Metadata } from "next";
import { DemoBanner } from "@/components/DemoBanner";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "CineMatch: what to watch tonight", template: "%s · CineMatch" },
  description: "Movie recommendations filtered to the streaming platforms you actually have.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans antialiased">
        <DemoBanner />
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
        <footer className="mx-auto max-w-7xl px-4 py-10 text-xs text-zinc-500">
          Movie data from{" "}
          <a className="underline" href="https://www.themoviedb.org" target="_blank" rel="noreferrer">TMDB</a>. Streaming
          availability by{" "}
          <a className="underline" href="https://www.justwatch.com" target="_blank" rel="noreferrer">JustWatch</a>. This product
          uses the TMDB API but is not endorsed or certified by TMDB.
        </footer>
      </body>
    </html>
  );
}
