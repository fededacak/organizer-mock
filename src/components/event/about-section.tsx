"use client";

import { useRef, useState, useLayoutEffect } from "react";
import { SectionHeader } from "./section-header";
import { YouTubeEmbed } from "./youtube-embed";

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
    <section
      className={`flex flex-col gap-3 ${hideBorder ? "" : "pb-6 lg:pb-4 border-b border-light-gray dark:border-[#2a2a35]"}`}
    >
      <div>
        <SectionHeader title="About" />
        <div className="text-sm text-black dark:text-[#d1d5db] leading-relaxed">
          <p
            ref={descriptionRef}
            className={`whitespace-pre-line ${showFull ? "" : "line-clamp-8"}`}
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
