"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Share2, X } from "lucide-react";
import type { Artist } from "./types";
import { YouTubeEmbed } from "./youtube-embed";
import { MusicNoteIcon } from "../icons/music-note-icon";
import { InstagramIcon } from "../icons/instagram-icon";
import { TiktokIcon } from "../icons/tiktok-icon";
import { SpotifyIcon } from "../icons/spotify-icon";

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
    <button
      type="button"
      onClick={onClick}
      className={`
        w-12 h-12 rounded-full overflow-hidden shrink-0 cursor-pointer transition-all duration-200 ease-out
        ${isSelected ? "scale-115 opacity-100 ring-2 ring-white ring-offset-2 ring-offset-black/50" : "opacity-70 hover:scale-105 hover:opacity-100 active:scale-100"}
      `}
    >
      {artist.hasImage ? (
        <Image
          src="/lineup-avatar.jpeg"
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
    </button>
  );
}

const imageSlideVariants = {
  enter: (direction: number) => ({
    y: direction > 0 ? "100%" : "-100%",
  }),
  center: {
    y: 0,
  },
  exit: (direction: number) => ({
    y: direction > 0 ? "-100%" : "100%",
  }),
};

const contentFadeVariants = {
  enter: {
    opacity: 0,
    scale: 0.97,
  },
  center: {
    opacity: 1,
    scale: 1,
  },
  exit: {
    opacity: 0,
    scale: 0.97,
  },
};

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
  const artist = open ? artists[selectedIndex] : null;
  const ref = useRef<HTMLDivElement>(null);
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const prevIndexRef = useRef(selectedIndex);

  // Derive direction from index change (positive = downward, negative = upward)
  const direction =
    selectedIndex > prevIndexRef.current
      ? 1
      : selectedIndex < prevIndexRef.current
        ? -1
        : 0;

  useEffect(() => {
    prevIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  // Close on escape key
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onOpenChange]);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const isInsideModal = ref.current?.contains(target);
      const isInsideThumbnails = thumbnailsRef.current?.contains(target);

      if (!isInsideModal && !isInsideThumbnails) {
        onOpenChange(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open, onOpenChange]);

  return (
    <AnimatePresence>
      {open && artist ? (
        <motion.div
          key="artist-modal"
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 flex items-end md:items-center justify-center">
            {/* Thumbnail Navigation - Left side */}
            {artists.length > 1 && (
              <motion.div
                ref={thumbnailsRef}
                className="absolute left-6 lg:flex flex-col gap-3 hidden"
                initial={{ x: 15, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 15, opacity: 0 }}
                transition={{
                  type: "spring",
                  bounce: 0,
                  duration: 0.3,
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
              </motion.div>
            )}

            {/* Modal Panel */}
            <motion.div
              ref={ref}
              className="bg-white dark:bg-[#1a1a22] shadow-lg w-full md:max-w-[1000px] md:mx-4 overflow-hidden relative rounded-t-[20px] md:rounded-[28px] will-change-transform flex flex-col md:block max-h-[90dvh] md:max-h-none"
              initial={{ y: 40 }}
              animate={{ y: 0 }}
              exit={{ y: 40 }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            >
              {/* Close Button */}
              <button
                onClick={() => onOpenChange(false)}
                className="absolute right-3 top-3 md:right-4 md:top-4 w-8 h-8 md:w-6 md:h-6 bg-black/40 md:bg-light-gray md:dark:bg-[#2a2a35] backdrop-blur-sm md:backdrop-blur-none rounded-full flex items-center justify-center hover:bg-black/50 md:hover:bg-soft-gray md:dark:hover:bg-[#3a3a45] active:scale-95 transition-all duration-200 ease cursor-pointer z-20"
              >
                <X className="w-4 h-4 text-white md:text-gray md:dark:text-[#888]" />
              </button>

              {/* Mobile scroll wrapper — becomes invisible (contents) on desktop */}
              <div className="flex-1 overflow-y-auto min-h-0 md:contents">

              {/* Left Side - Image */}
              <div className="w-full md:w-1/2 relative overflow-hidden md:py-3 md:pl-3 shrink-0">
                <div className="w-full aspect-square md:rounded-[16px] overflow-hidden relative">
                  <AnimatePresence
                    mode="popLayout"
                    initial={false}
                    custom={direction}
                  >
                    <motion.div
                      key={selectedIndex}
                      custom={direction}
                      variants={imageSlideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        type: "spring",
                        bounce: 0,
                        duration: 0.5,
                      }}
                      className="w-full h-full will-change-transform"
                    >
                      {artist.hasImage ? (
                        <div className="w-full h-full bg-mid-gray dark:bg-[#3a3a45]">
                          <Image
                            src="/lineup-avatar.jpeg"
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
              </div>

              {/* Right Side - Content */}
              <div className="relative md:absolute md:top-0 md:right-0 w-full md:w-1/2 md:h-full flex flex-col md:overflow-hidden">
                {/* Scrollable Content */}
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={selectedIndex}
                    variants={contentFadeVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      duration: 0.5,
                      type: "spring",
                      bounce: 0.1,
                    }}
                    className="md:flex-1 md:overflow-y-auto"
                  >
                    <div className="md:min-h-full flex flex-col md:justify-center pb-6">
                      {/* Name */}
                      <div className="pt-5 md:pt-8 pb-4 md:pb-5 md:sticky md:top-0 bg-white dark:bg-[#1a1a22] px-5 md:px-8">
                        <h2 className="font-outfit font-extrabold text-[24px] text-black dark:text-white">
                          {artist.name}
                        </h2>
                      </div>

                      {/* Additional Content - fades in */}
                      <div className="flex flex-col gap-4 md:gap-5 px-5 md:px-8">
                        {/* Description */}
                        {displaySettings.showDescription &&
                          artist.description && (
                            <p className="md:text-sm text-base text-muted-foreground leading-relaxed">
                              {artist.description}
                            </p>
                          )}

                        {/* Social Links */}
                        {((displaySettings.showInstagram &&
                          artist.instagramHandle) ||
                          (displaySettings.showTiktok &&
                            artist.tiktokHandle)) && (
                          <div className="flex items-center gap-3">
                            {displaySettings.showInstagram &&
                              artist.instagramHandle && (
                                <a
                                  href={`https://instagram.com/${artist.instagramHandle}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1.5  md:text-sm text-base text-muted-foreground hover:text-foreground transition-colors duration-200 ease"
                                >
                                  <InstagramIcon size={16} />
                                  <span>@{artist.instagramHandle}</span>
                                </a>
                              )}
                            {displaySettings.showTiktok &&
                              artist.tiktokHandle && (
                                <a
                                  href={`https://tiktok.com/@${artist.tiktokHandle}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1.5 md:text-sm text-base text-muted-foreground hover:text-foreground transition-colors duration-200 ease"
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
                                    <div className="w-[18px] h-[18px] rounded-full bg-[#1DB954] flex items-center justify-center shrink-0">
                                      <SpotifyIcon
                                        size={12}
                                        className="text-white"
                                      />
                                    </div>
                                  </div>
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
                        {displaySettings.showYouTube &&
                          artist.youtubeVideoId && (
                            <div className="w-full">
                              <h3 className="text-sm font-black text-black tracking-wide mb-2">
                                Featured Video
                              </h3>
                              <YouTubeEmbed videoId={artist.youtubeVideoId} />
                            </div>
                          )}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              </div>{/* End mobile scroll wrapper */}
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
