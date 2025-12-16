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
import { Expand } from "lucide-react";

const BANNER_IMAGES = [
  "/event-image.jpg",
  "/event-image-1.jpg",
  "/event-image-2.jpg",
];

interface EventBannerCarouselProps {
  eventName: string;
}

export function EventBannerCarousel({ eventName }: EventBannerCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

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

  return (
    <div className="relative w-full aspect-1014/400 rounded-2xl overflow-hidden bg-light-gray">
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
          {BANNER_IMAGES.map((src, index) => (
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

      {/* Zoom button */}
      <button className="absolute bottom-4 right-4 w-8 h-8 rounded-[10px] bg-black/25 flex items-center justify-center backdrop-blur-sm hover:bg-black transition-all duration-200 ease cursor-pointer hover:scale-[1.02] active:scale-[0.98]">
        <Expand className="w-4 h-4 text-white" />
      </button>

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
