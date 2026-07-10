"use client";

import { Button } from "@/components/ui/button";
import { Check, Copy, Link2 } from "lucide-react";
import { useState } from "react";

interface ShareLinkProps {
  analysisId: string;
}

export function ShareLink({ analysisId }: ShareLinkProps) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    const url = `${window.location.origin}/analysis/${analysisId}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={copyLink}>
      {copied ? (
        <>
          <Check />
          Copied
        </>
      ) : (
        <>
          <Copy />
          Copy share link
        </>
      )}
      <Link2 className="sr-only" />
    </Button>
  );
}
