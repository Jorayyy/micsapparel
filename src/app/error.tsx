"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="font-oswald text-7xl font-bold text-neutral-200 mb-4">500</p>
        <h1 className="font-oswald text-2xl font-bold uppercase tracking-tight mb-3">
          Something went wrong
        </h1>
        <p className="text-neutral-500 text-sm mb-8">
          An unexpected error occurred. Please try again.
        </p>
        <button
          type="button"
          onClick={reset}
          className="px-8 py-4 bg-black text-white font-oswald text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-800 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
