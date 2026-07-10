"use client";

import { CreditsBanner } from "@/components/credits-banner";
import { RecentSearches } from "@/components/recent-searches";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { analyzeSongRequest } from "@/lib/api-client";
import type { AnalyzeRequest } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BrainCircuit, Loader2, Music2, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AnalyzePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [artist, setArtist] = useState("");
  const [title, setTitle] = useState("");

  const mutation = useMutation({
    mutationFn: (payload: AnalyzeRequest) => analyzeSongRequest(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["recent"] });
      queryClient.invalidateQueries({ queryKey: ["credits"] });
      router.push(`/analysis/${data.id}`);
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    mutation.mutate({ artist: artist.trim(), title: title.trim() });
  }

  const outOfCredits = mutation.error?.message.includes("credits exhausted");

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
      <section className="space-y-3 text-center">
        <div className="bg-primary/10 text-primary mx-auto flex size-14 items-center justify-center rounded-2xl">
          <BrainCircuit className="size-7" />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Music Psychiatrist
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-base leading-relaxed">
          Enter an artist and song to analyze lyrics for schema therapy patterns,
          modes, coping styles, and psychological signals — each with a confidence
          score from 0 to 1.
        </p>
      </section>

      <CreditsBanner />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music2 className="size-5" />
            Song lookup
          </CardTitle>
          <CardDescription>
            Lyrics are fetched from public APIs, then analyzed by your configured AI model.
            Previously analyzed songs open instantly from cache.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="artist">Artist</Label>
              <Input
                id="artist"
                name="artist"
                placeholder="Michael Jackson"
                value={artist}
                onChange={(event) => setArtist(event.target.value)}
                required
                disabled={mutation.isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Song title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Billie Jean"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
                disabled={mutation.isPending}
              />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" className="w-full sm:w-auto" disabled={mutation.isPending}>
                {mutation.isPending ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Analyzing lyrics…
                  </>
                ) : (
                  <>
                    <Search />
                    Analyze song
                  </>
                )}
              </Button>
            </div>
          </form>

          {mutation.isError && (
            <p className={`mt-4 text-sm ${outOfCredits ? "text-destructive" : "text-destructive"}`}>
              {mutation.error.message}
            </p>
          )}
        </CardContent>
      </Card>

      <RecentSearches />
    </div>
  );
}
