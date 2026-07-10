import { Button } from "@/components/ui/button";
import { getSpotifySearchUrl, getYouTubeSearchUrl } from "@/lib/song-links";
import type { SongInfo } from "@/lib/types";
import { cn } from "@/lib/utils";

function SpotifyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn("size-4", className)} fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.49 17.308a.747.747 0 0 1-1.027.248 9.16 9.16 0 0 0-4.926-1.443c-1.653 0-3.183.43-4.527 1.18a.748.748 0 1 1-.744-1.298 10.75 10.75 0 0 1 5.271-1.375c1.955 0 3.794.51 5.455 1.403a.75.75 0 0 1 .248 1.027l-.75-.742zm1.478-3.285a.935.935 0 0 1-1.285.31 11.83 11.83 0 0 0-5.683-1.448c-2.135 0-4.126.555-5.852 1.528a.936.936 0 0 1-1.01-1.578 13.69 13.69 0 0 1 6.862-1.79c2.496 0 4.847.65 6.963 1.79a.936.936 0 0 1 .31 1.285l-.305-.097zm.17-3.364a1.12 1.12 0 0 1-1.543.372 14.75 14.75 0 0 0-6.65-1.575c-2.617 0-5.05.68-7.177 1.87a1.12 1.12 0 1 1-1.21-1.885 17.17 17.17 0 0 1 8.387-2.19c2.906 0 5.647.757 8.113 2.078a1.12 1.12 0 0 1 .372 1.543l-.292-.203z" />
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn("size-4", className)} fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

interface SongLinksProps {
  song: SongInfo;
  size?: "sm" | "default";
  className?: string;
}

export function SongLinks({ song, size = "sm", className }: SongLinksProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <Button variant="outline" size={size} asChild>
        <a
          href={getSpotifySearchUrl(song)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${song.title} on Spotify`}
        >
          <SpotifyIcon className="text-[#1DB954]" />
          Spotify
        </a>
      </Button>
      <Button variant="outline" size={size} asChild>
        <a
          href={getYouTubeSearchUrl(song)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${song.title} on YouTube`}
        >
          <YouTubeIcon className="text-[#FF0000]" />
          YouTube
        </a>
      </Button>
    </div>
  );
}
