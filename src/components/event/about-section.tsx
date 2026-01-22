"use client";

import { useRef, useState, useLayoutEffect } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { SectionHeader } from "./section-header";

const YOUTUBE_THUMBNAILS = [
  "/youtube/youtube-thumbnail.jpg",
  "/youtube/youtube-thumbnail-2.jpg",
];

interface AboutSectionProps {
  description: string;
  showFull: boolean;
  onToggle: () => void;
  youtubeVideoCount?: 0 | 1 | 2;
  hideBorder?: boolean;
}

export function AboutSection({
  description,
  showFull,
  onToggle,
  youtubeVideoCount = 1,
  hideBorder,
}: AboutSectionProps) {
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const [isClamped, setIsClamped] = useState(false);

  useLayoutEffect(() => {
    const el = descriptionRef.current;
    if (el && !showFull) {
      setIsClamped(el.scrollHeight > el.clientHeight);
    }
  }, [description, showFull]);

  const videosToShow = YOUTUBE_THUMBNAILS.slice(0, youtubeVideoCount);

  return (
    <section className={`flex flex-col gap-3 ${hideBorder ? "" : "pb-4 border-b border-light-gray dark:border-[#2a2a35]"}`}>
      <div>
        <SectionHeader title="About" />
        <div className="text-sm text-black dark:text-[#d1d5db] leading-relaxed">
          <p
            ref={descriptionRef}
            className={`whitespace-pre-line ${showFull ? "" : "line-clamp-5"}`}
          >
            {description}
          </p>
        </div>
      </div>
      {(isClamped || showFull) && (
        <button
          onClick={onToggle}
          className="self-start border cursor-pointer border-neutral-200 dark:border-[#3a3a45] rounded-[30px] px-3 py-1.5 flex items-center hover:border-mid-gray dark:hover:border-[#6b7280] transition-colors duration-200 ease"
        >
          <span className="font-bold text-[9px] text-black dark:text-white uppercase tracking-tight">
            {showFull ? "show less" : "show more"}
          </span>
        </button>
      )}

      {/* YouTube Videos */}
      {videosToShow.length > 0 && (
        <div className="flex flex-col gap-3 mt-1">
          {videosToShow.map((thumbnail, index) => (
            <YouTubeEmbed key={index} thumbnail={thumbnail} />
          ))}
        </div>
      )}
    </section>
  );
}

function YouTubeEmbed({ thumbnail }: { thumbnail: string }) {
  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black group cursor-pointer">
      {/* Thumbnail */}
      <Image
        src={thumbnail}
        alt="YouTube video thumbnail"
        fill
        className="object-cover"
      />

      {/* Dark overlay on hover */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 ease" />

      {/* YouTube Play Button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[68px] h-[48px] bg-[#212121]/80 group-hover:bg-[#ff0000] rounded-xl flex items-center justify-center transition-colors duration-200 ease">
          <Play className="w-7 h-7 text-white fill-white ml-1" />
        </div>
      </div>

      {/* YouTube branding - bottom left */}
      <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
        <svg
          viewBox="0 0 90 20"
          className="h-4 text-white drop-shadow-md"
          fill="currentColor"
        >
          <path d="M27.973 5.27c-.227-.843-.896-1.508-1.745-1.732C24.376 3 15 3 15 3s-9.376 0-11.228.538c-.85.224-1.518.889-1.745 1.732C1.5 7.108 1.5 11 1.5 11s0 3.892.527 5.73c.227.843.896 1.508 1.745 1.732C5.624 19 15 19 15 19s9.376 0 11.228-.538c.85-.224 1.518-.889 1.745-1.732.527-1.838.527-5.73.527-5.73s0-3.892-.527-5.73zM12.196 14.5V7.5l6.304 3.5-6.304 3.5z" />
          <path d="M36.727 17.545h-1.909V8.091h-2.636V6.455h7.182v1.636h-2.637v9.454zM47.545 17.545h-1.727v-1h-.045c-.432.727-1.137 1.182-2.137 1.182-1.773 0-2.864-1.364-2.864-3.409V8.091h1.909v5.909c0 1.227.545 1.909 1.591 1.909 1.091 0 1.864-.818 1.864-2.045V8.091h1.909v9.454h-.5zM49.227 8.091h1.818v1.045h.046c.455-.773 1.273-1.227 2.318-1.227 1.909 0 3.182 1.545 3.182 3.909 0 2.364-1.318 3.909-3.227 3.909-1.046 0-1.818-.409-2.273-1.136h-.045v3.863h-1.819V8.091zm5.409 3.727c0-1.455-.682-2.409-1.773-2.409-1.091 0-1.818.955-1.818 2.409 0 1.455.727 2.409 1.818 2.409 1.091 0 1.773-.954 1.773-2.409zM62.364 14.818c-.273 1.727-1.864 2.909-3.909 2.909-2.636 0-4.273-1.773-4.273-4.545 0-2.773 1.682-4.636 4.182-4.636 2.455 0 4.046 1.727 4.046 4.409v.682h-6.319v.091c0 1.455.864 2.409 2.273 2.409.955 0 1.727-.455 2-1.227l2 .908zm-6.273-3h4.455c-.046-1.318-.819-2.182-2.137-2.182-1.318 0-2.182.909-2.318 2.182z" />
        </svg>
      </div>

      {/* Video duration badge - bottom right */}
      <div className="absolute bottom-3 right-3 bg-black/80 px-1.5 py-0.5 rounded text-xs font-medium text-white">
        4:32
      </div>
    </div>
  );
}
