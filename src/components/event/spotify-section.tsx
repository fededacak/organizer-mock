import Image from "next/image";
import { Play, Share2 } from "lucide-react";
import { SectionHeader } from "./section-header";
import type { Playlist } from "./types";

interface SpotifySectionProps {
  playlist: Playlist;
}

export function SpotifySection({ playlist }: SpotifySectionProps) {
  return (
    <section className="border-b border-light-gray dark:border-[#2a2a35] pb-4">
      <SectionHeader title="Playlist" />
      <div
        className="rounded-2xl overflow-hidden h-20"
        style={{
          background:
            "linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.8) 100%), linear-gradient(90deg, rgb(175, 94, 114) 0%, rgb(175, 94, 114) 100%)",
        }}
      >
        <div className="flex h-full">
          {/* Album Art */}
          <div className="relative w-20 h-20 bg-gray shrink-0">
            <Image
              src="/album-cover.jpg"
              alt="Album cover"
              width={80}
              height={80}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-black/30 flex items-center justify-center">
                <Play className="w-5 h-5 text-white fill-white" />
              </div>
            </div>
          </div>
          {/* Track Info */}
          <div className="flex-1 p-2 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-white truncate drop-shadow-sm">
                  {playlist.trackName}
                </p>
                <p className="text-sm text-white truncate drop-shadow-sm">
                  {playlist.artist}
                </p>
              </div>
              {/* Spotify icon */}
              <div className="w-[18px] h-[18px] rounded-full bg-[#1DB954] flex items-center justify-center shrink-0">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
              </div>
            </div>
            {/* Progress bar and share */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1 bg-white/30 rounded-full">
                <div className="w-0 h-full bg-white rounded-full" />
              </div>
              <Share2 className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
