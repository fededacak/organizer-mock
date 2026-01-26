"use client";

import Image from "next/image";
import { Play, Share2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Artist } from "./types";
import { YouTubeEmbed } from "./youtube-embed";
import { MusicNoteIcon } from "../icons/music-note-icon";
import { InstagramIcon } from "../icons/instagram-icon";
import { TiktokIcon } from "../icons/tiktok-icon";
import { SpotifyIcon } from "../icons/spotify-icon";

const springTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
};

export interface LineupDisplaySettings {
  showDescription: boolean;
  showSpotify: boolean;
  showYouTube: boolean;
  showInstagram: boolean;
  showTiktok: boolean;
}

interface ArtistModalProps {
  artists: Artist[];
  selectedIndex: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectArtist: (index: number) => void;
  displaySettings?: LineupDisplaySettings;
}

function ArtistThumbnail({
  artist,
  isSelected,
  onClick,
}: {
  artist: Artist;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      animate={{
        scale: isSelected ? 1.15 : 1,
        opacity: isSelected ? 1 : 0.7,
      }}
      whileHover={{ scale: isSelected ? 1.15 : 1.08, opacity: 1 }}
      whileTap={{ scale: 0.95 }}
      transition={springTransition}
      className={`
        w-12 h-12 rounded-full overflow-hidden shrink-0 cursor-pointer
        ${isSelected ? "ring-2 ring-white ring-offset-2 ring-offset-black/50" : ""}
      `}
    >
      {artist.hasImage ? (
        <Image
          src="/lineup-avatar.jpg"
          alt={artist.name}
          width={48}
          height={48}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-tp-orange flex items-center justify-center">
          <MusicNoteIcon size={24} className="text-white opacity-90" />
        </div>
      )}
    </motion.button>
  );
}

export function ArtistModal({
  artists,
  selectedIndex,
  open,
  onOpenChange,
  onSelectArtist,
  displaySettings = {
    showDescription: true,
    showSpotify: true,
    showYouTube: true,
    showInstagram: true,
    showTiktok: true,
  },
}: ArtistModalProps) {
  const artist = artists[selectedIndex];

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!open || !artist) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/60 animate-in fade-in duration-200 backdrop-blur-sm"
        onClick={handleOverlayClick}
      />

      {/* Modal Container with Thumbnails */}
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        {/* Thumbnail Navigation - Left side */}
        {artists.length > 1 && (
          <div
            className="absolute left-8 flex flex-col gap-3 pointer-events-auto animate-in fade-in slide-in-from-left-4 duration-300"
            style={{
              animationTimingFunction: "cubic-bezier(.165, .84, .44, 1)",
            }}
          >
            {artists.map((a, index) => (
              <ArtistThumbnail
                key={a.id}
                artist={a}
                isSelected={index === selectedIndex}
                onClick={() => onSelectArtist(index)}
              />
            ))}
          </div>
        )}
        {/* Modal Panel */}
        <div className="bg-white dark:bg-[#1a1a22] rounded-[28px] shadow-lg w-full max-w-[1000px] mx-4 pointer-events-auto animate-in fade-in zoom-in-95 duration-200 overflow-hidden relative">
          {/* Left Side - Image drives the height */}
          <div className="w-1/2 relative overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={artist.id + "-image"}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={springTransition}
                className="w-full aspect-square"
              >
                {artist.hasImage ? (
                  <div className="w-full h-full bg-mid-gray dark:bg-[#3a3a45]">
                    <Image
                      src="/lineup-avatar.jpg"
                      alt={artist.name}
                      width={500}
                      height={500}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full bg-tp-orange flex items-center justify-center">
                    <MusicNoteIcon
                      size={80}
                      className="text-white opacity-90"
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Side - Content (absolute to match image height) */}
          <div className="absolute top-0 right-0 w-1/2 h-full flex flex-col">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 w-6 h-6 bg-light-gray dark:bg-[#2a2a35] rounded-full flex items-center justify-center hover:bg-soft-gray dark:hover:bg-[#3a3a45] transition-colors duration-200 ease cursor-pointer z-20"
            >
              <X className="w-4 h-4 text-gray dark:text-[#888]" />
            </button>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={artist.id + "-content"}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={springTransition}
                  className="min-h-full flex flex-col justify-center pb-6"
                >
                  {/* Sticky Name */}
                  <div className="sticky top-0 z-10 bg-white dark:bg-[#1a1a22] pb-4 pt-10 pl-8 pr-14">
                    <h2 className="font-outfit font-extrabold text-[24px] text-black dark:text-white">
                      {artist.name}
                    </h2>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col gap-5 px-8">
                    {/* Description */}
                    {displaySettings.showDescription && artist.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {artist.description}
                      </p>
                    )}

                    {/* Social Links */}
                    {((displaySettings.showInstagram &&
                      artist.instagramHandle) ||
                      (displaySettings.showTiktok && artist.tiktokHandle)) && (
                      <div className="flex items-center gap-3">
                        {displaySettings.showInstagram &&
                          artist.instagramHandle && (
                            <a
                              href={`https://instagram.com/${artist.instagramHandle}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 ease"
                            >
                              <InstagramIcon size={16} />
                              <span>@{artist.instagramHandle}</span>
                            </a>
                          )}
                        {displaySettings.showTiktok && artist.tiktokHandle && (
                          <a
                            href={`https://tiktok.com/@${artist.tiktokHandle}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 ease"
                          >
                            <TiktokIcon size={16} />
                            <span>@{artist.tiktokHandle}</span>
                          </a>
                        )}
                      </div>
                    )}

                    {/* Spotify Track */}
                    {displaySettings.showSpotify && artist.spotifyTrack && (
                      <div className="w-full">
                        <h3 className="text-sm font-black text-black tracking-wide mb-2">
                          Playlist
                        </h3>
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
                                    {artist.spotifyTrack.trackName}
                                  </p>
                                  <p className="text-sm text-white truncate drop-shadow-sm">
                                    {artist.spotifyTrack.artist}
                                  </p>
                                </div>
                                {/* Spotify icon */}
                                <div className="w-[18px] h-[18px] rounded-full bg-[#1DB954] flex items-center justify-center shrink-0">
                                  <SpotifyIcon
                                    size={12}
                                    className="text-white"
                                  />
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
                      </div>
                    )}

                    {/* YouTube Video */}
                    {displaySettings.showYouTube && artist.youtubeVideoId && (
                      <div className="w-full">
                        <h3 className="text-sm font-black text-black tracking-wide mb-2">
                          Featured Video
                        </h3>
                        <YouTubeEmbed videoId={artist.youtubeVideoId} />
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
