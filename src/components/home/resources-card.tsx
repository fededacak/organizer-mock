import { Play } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface VideoItemProps {
  thumbnail: string;
  title: string;
  duration: string;
}

function VideoItem({ thumbnail, title, duration }: VideoItemProps) {
  return (
    <button className="flex h-[94px] w-full items-center gap-5 rounded-2xl bg-white p-2.5 text-left transition-colors duration-200 ease hover:bg-light-gray/50">
      {/* Thumbnail */}
      <div className="relative h-[70px] w-[112px] shrink-0 overflow-hidden rounded-xl">
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover"
          sizes="112px"
        />
        <div className="absolute inset-0 bg-black/10" />
        {/* Play button */}
        <div className="absolute left-1/2 top-1/2 flex size-[30px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 pl-0.5">
          <Play className="size-3 fill-white text-white" />
        </div>
      </div>
      {/* Content */}
      <div className="flex flex-1 flex-col gap-1.5">
        <h4 className="font-outfit text-base font-bold text-black">{title}</h4>
        <span className="font-outfit text-sm font-normal text-dark-gray">
          {duration}
        </span>
      </div>
    </button>
  );
}

interface ResourcesCardProps {
  className?: string;
}

export function ResourcesCard({ className }: ResourcesCardProps) {
  const videos: VideoItemProps[] = [
    {
      thumbnail: "/event-image-1.jpg",
      title: "Create add-on tickets for your events",
      duration: "1 min",
    },
    {
      thumbnail: "/event-image-2.jpg",
      title: "Offer discounts with promo codes",
      duration: "2 min",
    },
  ];

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-6 rounded-[20px] bg-white px-3.5 py-6 shadow-card",
        className
      )}
    >
      <div className="flex items-center justify-center px-2.5">
        <h2 className="flex-1 font-outfit text-xl font-black text-black">
          Resources For You
        </h2>
      </div>
      <div className="flex flex-col gap-1.5">
        {videos.map((video, index) => (
          <div key={video.title}>
            <VideoItem {...video} />
            {index < videos.length - 1 && (
              <div className="h-px w-full bg-light-gray" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}




