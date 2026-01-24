"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ImageLightbox } from "./image-lightbox";
import { ImageIcon } from "lucide-react";

const ALL_BANNER_IMAGES = [
  "/event-image.jpg",
  "/event-image-1.jpg",
  "/event-image-2.jpg",
];

interface EventBannerGridProps {
  eventName: string;
  imageCount?: 0 | 1 | 2 | 3;
  layoutIdPrefix?: string;
}

export function EventBannerGrid({
  eventName,
  imageCount = 3,
  layoutIdPrefix = "banner-grid",
}: EventBannerGridProps) {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);

  const images = React.useMemo(() => {
    if (imageCount === 0) return [];
    return ALL_BANNER_IMAGES.slice(0, imageCount);
  }, [imageCount]);

  const handleImageClick = (index: number) => {
    setSelectedIndex(index);
  };

  const handleClose = () => {
    setSelectedIndex(null);
  };

  const handleNavigate = (index: number) => {
    setSelectedIndex(index);
  };

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
      <>
        <div className="relative w-full">
          <div className="relative aspect-5/2 overflow-hidden lg:rounded-2xl md:rounded-[20px] rounded-none bg-light-gray dark:bg-[#1e1e26]">
            <GridImage
              src={images[0]}
              alt={eventName}
              priority
              index={0}
              onClick={() => handleImageClick(0)}
              layoutIdPrefix={layoutIdPrefix}
            />
          </div>
        </div>
        <ImageLightbox
          images={images}
          selectedIndex={selectedIndex}
          onClose={handleClose}
          onNavigate={handleNavigate}
          layoutId={
            selectedIndex !== null
              ? `${layoutIdPrefix}-${selectedIndex}`
              : undefined
          }
        />
      </>
    );
  }

  // 2 images - side by side, each 5:2
  if (imageCount === 2) {
    return (
      <>
        <div className="grid grid-cols-1 gap-0.5 md:gap-1">
          <div className="relative aspect-5/2 overflow-hidden md:rounded-b-[4px] lg:rounded-t-2xl md:rounded-t-[20px] bg-light-gray dark:bg-[#1e1e26]">
            <GridImage
              src={images[0]}
              alt={`${eventName} - Image 1`}
              priority
              index={0}
              onClick={() => handleImageClick(0)}
              layoutIdPrefix={layoutIdPrefix}
            />
          </div>
          <div className="relative aspect-5/2 overflow-hidden md:rounded-t-[4px] lg:rounded-b-2xl md:rounded-b-[20px] rounded-none bg-light-gray dark:bg-[#1e1e26]">
            <GridImage
              src={images[1]}
              alt={`${eventName} - Image 2`}
              index={1}
              onClick={() => handleImageClick(1)}
              layoutIdPrefix={layoutIdPrefix}
            />
          </div>
        </div>
        <ImageLightbox
          images={images}
          selectedIndex={selectedIndex}
          onClose={handleClose}
          onNavigate={handleNavigate}
          layoutId={
            selectedIndex !== null
              ? `${layoutIdPrefix}-${selectedIndex}`
              : undefined
          }
        />
      </>
    );
  }

  // 3 images - 1 top full width + 2 bottom, each 5:2
  if (imageCount === 3) {
    return (
      <>
        <div className="flex flex-col gap-0.5 md:gap-1">
          <div className="relative aspect-5/2 overflow-hidden md:rounded-b-[4px] md:rounded-t-[20px] rounded-none bg-light-gray dark:bg-[#1e1e26]">
            <GridImage
              src={images[0]}
              alt={`${eventName} - Image 1`}
              priority
              index={0}
              onClick={() => handleImageClick(0)}
              layoutIdPrefix={layoutIdPrefix}
            />
          </div>
          <div className="grid grid-cols-2 gap-0.5 md:gap-1">
            <div className="relative aspect-5/2 overflow-hidden md:rounded-t-[4px] rounded-br-[4px] md:rounded-bl-[20px] bg-light-gray dark:bg-[#1e1e26]">
              <GridImage
                src={images[1]}
                alt={`${eventName} - Image 2`}
                index={1}
                onClick={() => handleImageClick(1)}
                layoutIdPrefix={layoutIdPrefix}
              />
            </div>
            <div className="relative aspect-5/2 overflow-hidden md:rounded-t-[4px] rounded-bl-[4px] md:rounded-br-[20px] rounded-none bg-light-gray dark:bg-[#1e1e26]">
              <GridImage
                src={images[2]}
                alt={`${eventName} - Image 3`}
                index={2}
                onClick={() => handleImageClick(2)}
                layoutIdPrefix={layoutIdPrefix}
              />
            </div>
          </div>
        </div>
        <ImageLightbox
          images={images}
          selectedIndex={selectedIndex}
          onClose={handleClose}
          onNavigate={handleNavigate}
          layoutId={
            selectedIndex !== null
              ? `${layoutIdPrefix}-${selectedIndex}`
              : undefined
          }
        />
      </>
    );
  }

  // Fallback (shouldn't reach here with valid imageCount)
  return null;
}

function GridImage({
  src,
  alt,
  priority = false,
  index,
  onClick,
  layoutIdPrefix,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  index: number;
  onClick: () => void;
  layoutIdPrefix: string;
}) {
  return (
    <motion.div
      layoutId={`${layoutIdPrefix}-${index}`}
      className="absolute inset-0 cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`View ${alt} fullscreen`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      whileHover={{ scale: 1.02 }}
      transition={{
        layout: { type: "spring", stiffness: 300, damping: 30 },
        scale: { duration: 0.3, ease: [0.215, 0.61, 0.355, 1] },
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        priority={priority}
        unoptimized
      />
    </motion.div>
  );
}
