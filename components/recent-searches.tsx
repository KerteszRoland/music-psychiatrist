"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchRecentAnalyses } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { Clock, Music2 } from "lucide-react";
import Link from "next/link";

function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60_000);

  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}

export function RecentSearches() {
  const { data, isLoading } = useQuery({
    queryKey: ["recent"],
    queryFn: fetchRecentAnalyses,
    staleTime: 30_000,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!data?.length) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="size-5" />
          Recent analyses
        </CardTitle>
        <CardDescription>Previously analyzed songs with shareable links</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="divide-border divide-y">
          {data.map((entry) => (
            <li key={entry.id}>
              <Link
                href={`/analysis/${entry.id}`}
                className="hover:bg-muted/60 -mx-2 flex items-center justify-between gap-3 rounded-lg px-2 py-3 transition-colors"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg">
                    <Music2 className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{entry.title}</p>
                    <p className="text-muted-foreground truncate text-sm">{entry.artist}</p>
                  </div>
                </div>
                <span className="text-muted-foreground shrink-0 text-xs">
                  {formatRelativeTime(entry.createdAt)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
