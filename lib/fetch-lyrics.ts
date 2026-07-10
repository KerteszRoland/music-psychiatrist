import type { LyricsResult, SongInfo } from "@/lib/types";

const LYRICS_OVH_BASE = "https://api.lyrics.ovh/v1";
const LRCLIB_SEARCH = "https://lrclib.net/api/search";

async function fetchFromLyricsOvh(song: SongInfo): Promise<string | null> {
  const url = `${LYRICS_OVH_BASE}/${encodeURIComponent(song.artist)}/${encodeURIComponent(song.title)}`;

  const response = await fetch(url);
  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as { lyrics?: string };
  const lyrics = data.lyrics?.trim();
  return lyrics || null;
}

async function fetchFromLrclib(song: SongInfo): Promise<string | null> {
  const query = `${song.artist} ${song.title}`;
  const url = `${LRCLIB_SEARCH}?q=${encodeURIComponent(query)}`;

  const response = await fetch(url);
  if (!response.ok) {
    return null;
  }

  const results = (await response.json()) as Array<{
    plainLyrics?: string | null;
    syncedLyrics?: string | null;
  }>;

  const match = results.find((entry) => entry.plainLyrics?.trim());
  return match?.plainLyrics?.trim() ?? null;
}

export async function fetchLyrics(song: SongInfo): Promise<LyricsResult> {
  const fromOvh = await fetchFromLyricsOvh(song);
  if (fromOvh) {
    return { lyrics: fromOvh, source: "lyrics.ovh" };
  }

  const fromLrclib = await fetchFromLrclib(song);
  if (fromLrclib) {
    return { lyrics: fromLrclib, source: "lrclib" };
  }

  throw new Error(
    `Could not find lyrics for "${song.title}" by ${song.artist}. Try a different spelling or check the song name.`,
  );
}
