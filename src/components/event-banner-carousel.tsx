"use client";

import * as React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ImageIcon } from "lucide-react";

const ALL_BANNER_IMAGES = [
  "/event-image.jpg",
  "/event-image-1.jpg",
  "/event-image-2.jpg",
];

interface EventBannerCarouselProps {
  eventName: string;
  imageCount?: 0 | 1 | 2 | 3 | 4;
}

export function EventBannerCarousel({
  eventName,
  imageCount = 3,
}: EventBannerCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  const images = React.useMemo(() => {
    if (imageCount === 0) return [];
    if (imageCount === 1) return [ALL_BANNER_IMAGES[0]];
    // For carousel, show up to 3 images regardless of count
    return ALL_BANNER_IMAGES.slice(0, Math.min(imageCount, 3));
  }, [imageCount]);

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const scrollTo = React.useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  // Placeholder when no images
  if (imageCount === 0) {
    return (
      <div className="relative w-full aspect-1014/400 lg:rounded-2xl md:rounded-[20px] rounded-none overflow-hidden bg-light-gray dark:bg-[#1e1e26] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-dark-gray dark:text-[#6b7280]">
          <ImageIcon className="w-12 h-12" />
          <span className="text-sm font-medium">No event image</span>
        </div>
      </div>
    );
  }

  // Single image - no carousel
  if (imageCount === 1) {
    return (
      <div className="relative w-full aspect-1014/400 lg:rounded-2xl md:rounded-[20px] rounded-none overflow-hidden bg-light-gray">
        <Image
          src={images[0]}
          alt={eventName}
          fill
          className="object-cover"
          priority
          unoptimized
        />
      </div>
    );
  }

  // Multiple images - carousel
  return (
    <div className="relative w-full aspect-1014/400 lg:rounded-2xl md:rounded-[20px] rounded-none overflow-hidden bg-light-gray">
      <Carousel
        setApi={setApi}
        opts={{
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
        className="w-full h-full"
      >
        <CarouselContent className="h-full ml-0">
          {images.map((src, index) => (
            <CarouselItem key={index} className="h-full pl-0">
              <div className="relative w-full h-full">
                <Image
                  src={src}
                  alt={`${eventName} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  unoptimized
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Pager dots */}
      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`w-1.5 h-1.5 rounded-full transition-opacity duration-200 ease cursor-pointer ${
              index === current ? "bg-white" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
