"use client";

import * as React from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

const ALL_BANNER_IMAGES = [
  "/event-image.jpg",
  "/event-image-1.jpg",
  "/event-image-2.jpg",
  "/event-image-3.jpg",
];

interface EventBannerGridProps {
  eventName: string;
  imageCount?: 0 | 1 | 2 | 3 | 4;
}

export function EventBannerGrid({
  eventName,
  imageCount = 4,
}: EventBannerGridProps) {
  const images = React.useMemo(() => {
    if (imageCount === 0) return [];
    return ALL_BANNER_IMAGES.slice(0, imageCount);
  }, [imageCount]);

  // Placeholder when no images
  if (imageCount === 0) {
    return (
      <div className="relative w-full aspect-5/2 lg:rounded-2xl md:rounded-[20px] rounded-none overflow-hidden bg-light-gray dark:bg-[#1e1e26] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-dark-gray dark:text-[#6b7280]">
          <ImageIcon className="w-12 h-12" />
          <span className="text-sm font-medium">No event image</span>
        </div>
      </div>
    );
  }

  // Single image - full width, 5:2 aspect ratio
  if (imageCount === 1) {
    return (
      <div className="relative w-full">
        <div className="relative aspect-5/2 overflow-hidden lg:rounded-2xl md:rounded-[20px] rounded-none bg-light-gray dark:bg-[#1e1e26]">
          <GridImage src={images[0]} alt={eventName} priority />
        </div>
      </div>
    );
  }

  // 2 images - side by side, each 5:2
  if (imageCount === 2) {
    return (
      <div className="grid grid-cols-1 gap-1">
        <div className="relative aspect-5/2 overflow-hidden rounded-b-[4px] lg:rounded-t-2xl md:rounded-t-[20px] bg-light-gray dark:bg-[#1e1e26]">
          <GridImage src={images[0]} alt={`${eventName} - Image 1`} priority />
        </div>
        <div className="relative aspect-5/2 overflow-hidden rounded-t-[4px] lg:rounded-b-2xl md:rounded-b-[20px] rounded-none bg-light-gray dark:bg-[#1e1e26]">
          <GridImage src={images[1]} alt={`${eventName} - Image 2`} />
        </div>
      </div>
    );
  }

  // 3 images - 1 top full width + 2 bottom, each 5:2
  if (imageCount === 3) {
    return (
      <div className="flex flex-col gap-1">
        <div className="relative aspect-5/2 overflow-hidden rounded-b-[4px] md:rounded-t-[20px] rounded-none bg-light-gray dark:bg-[#1e1e26]">
          <GridImage src={images[0]} alt={`${eventName} - Image 1`} priority />
        </div>
        <div className="grid grid-cols-2 gap-1">
          <div className="relative aspect-5/2 overflow-hidden rounded-t-[4px] rounded-br-[4px] md:rounded-bl-[20px] bg-light-gray dark:bg-[#1e1e26]">
            <GridImage src={images[1]} alt={`${eventName} - Image 2`} />
          </div>
          <div className="relative aspect-5/2 overflow-hidden rounded-t-[4px] rounded-bl-[4px] md:rounded-br-[20px] rounded-none bg-light-gray dark:bg-[#1e1e26]">
            <GridImage src={images[2]} alt={`${eventName} - Image 3`} />
          </div>
        </div>
      </div>
    );
  }

  // 4 images - 2x2 grid, each 5:2
  return (
    <div className="grid grid-cols-2 gap-1">
      <div className="relative aspect-5/2 overflow-hidden lg:rounded-tl-2xl md:rounded-tl-[20px] rounded-[4px] bg-light-gray dark:bg-[#1e1e26]">
        <GridImage src={images[0]} alt={`${eventName} - Image 1`} priority />
      </div>
      <div className="relative aspect-5/2 overflow-hidden lg:rounded-tr-2xl md:rounded-tr-[20px] rounded-[4px] bg-light-gray dark:bg-[#1e1e26]">
        <GridImage src={images[1]} alt={`${eventName} - Image 2`} />
      </div>
      <div className="relative aspect-5/2 overflow-hidden lg:rounded-bl-2xl md:rounded-bl-[20px] rounded-[4px] bg-light-gray dark:bg-[#1e1e26]">
        <GridImage src={images[2]} alt={`${eventName} - Image 3`} />
      </div>
      <div className="relative aspect-5/2 overflow-hidden lg:rounded-br-2xl md:rounded-br-[20px] rounded-[4px] bg-light-gray dark:bg-[#1e1e26]">
        <GridImage src={images[3]} alt={`${eventName} - Image 4`} />
      </div>
    </div>
  );
}

function GridImage({
  src,
  alt,
  priority = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover transition-transform duration-300 ease-out hover:scale-[1.02]"
      priority={priority}
      unoptimized
    />
  );
}
