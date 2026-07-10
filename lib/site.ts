export const siteConfig = {
  name: "Music Psychiatrist",
  title: "Music Psychiatrist — Schema Therapy Lyric Analysis",
  description:
    "Analyze song lyrics for schema therapy patterns, psychological modes, coping styles, and emotional signals. Get shareable results with confidence scores.",
  tagline: "Schema therapy patterns in song lyrics",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://music-psychiatrist.vercel.app",
  keywords: [
    "schema therapy",
    "lyric analysis",
    "song psychology",
    "music analysis",
    "emotional patterns",
    "mental health music",
    "lyrics analyzer",
  ],
  author: "Kertesz Roland",
  locale: "en_US",
} as const;

export function absoluteUrl(path = ""): string {
  const base = siteConfig.url.replace(/\/$/, "");
  const suffix = path.startsWith("/") ? path : path ? `/${path}` : "";
  return `${base}${suffix}`;
}
