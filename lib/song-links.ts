import type { SongInfo } from "@/lib/types";

function songQuery(song: SongInfo): string {
  return `${song.artist} ${song.title}`.trim();
}

export function getSpotifySearchUrl(song: SongInfo): string {
  return `https://open.spotify.com/search/${encodeURIComponent(songQuery(song))}`;
}

export function getYouTubeSearchUrl(song: SongInfo): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(songQuery(song))}`;
}
