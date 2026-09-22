import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Loading",
  robots: { index: false, follow: false },
};

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="w-8 h-8 border-2 border-neutral-300 border-t-black rounded-full animate-spin" />
      <p className="text-xs tracking-[0.25em] uppercase text-neutral-400">Loading</p>
    </div>
  );
}
