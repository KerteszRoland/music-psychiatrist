import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AnalysisNotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 py-20 text-center">
      <h1 className="text-2xl font-semibold">Analysis not found</h1>
      <p className="text-muted-foreground">
        This link may be invalid or the analysis was removed.
      </p>
      <Button asChild>
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
}
