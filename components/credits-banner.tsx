"use client";

import { fetchCreditsStatus } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Sparkles } from "lucide-react";

const SUPPORT_EMAIL = "kerteszroland02@gmail.com";

export function CreditsBanner() {
  const { data } = useQuery({
    queryKey: ["credits"],
    queryFn: fetchCreditsStatus,
    staleTime: 60_000,
    refetchInterval: 120_000,
  });

  if (!data?.available) {
    return null;
  }

  if (data.outOfCredits) {
    return (
      <div
        role="alert"
        className="relative overflow-hidden rounded-xl border border-red-500/50 bg-gradient-to-r from-red-950/90 via-red-900/80 to-orange-950/90 px-5 py-4 shadow-lg shadow-red-950/40"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.25),transparent_55%)]" />
        <div className="relative flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-500/20 ring-2 ring-red-400/40">
            <AlertTriangle className="size-5 text-red-300" />
          </div>
          <p className="text-sm leading-relaxed text-red-100">
            New song analyses are paused for now. Contact{" "}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="font-medium underline underline-offset-4 hover:text-white"
            >
              {SUPPORT_EMAIL}
            </a>{" "}
            to support the project.
          </p>
        </div>
      </div>
    );
  }

  if (!data.lowCredits) {
    return null;
  }

  return (
    <div
      role="alert"
      className="relative overflow-hidden rounded-xl border border-amber-400/50 bg-gradient-to-r from-amber-950/90 via-orange-950/80 to-amber-900/90 px-5 py-4 shadow-lg shadow-amber-950/40"
    >
      <div className="pointer-events-none absolute inset-0 animate-pulse bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.2),transparent_50%)]" />
      <div className="relative flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-500/20 ring-2 ring-amber-400/40">
          <Sparkles className="size-5 text-amber-300" />
        </div>
        <p className="text-sm leading-relaxed text-amber-100">
          Few song analyses left. Contact{" "}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="font-medium underline underline-offset-4 hover:text-white"
          >
            {SUPPORT_EMAIL}
          </a>{" "}
          to support the project.
        </p>
      </div>
    </div>
  );
}
