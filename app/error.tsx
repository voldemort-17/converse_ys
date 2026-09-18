"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="grid min-h-[70vh] place-items-center px-4 text-center">
      <div className="surface max-w-md p-8">
        <AlertTriangle className="mx-auto text-amber-400" size={36} />
        <h1 className="mt-4 text-2xl font-bold">We couldn&apos;t load this page</h1>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          The service may be temporarily unavailable. Check your connection and try again.
        </p>
        <button type="button" onClick={reset} className="primary-button mx-auto mt-6">
          <RefreshCw size={17} />
          Try again
        </button>
      </div>
    </div>
  );
}
