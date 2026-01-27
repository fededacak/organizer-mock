import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ExternalLink } from "lucide-react";

// Breadcrumb component
function Breadcrumb() {
  return (
    <div className="flex items-center gap-1">
      <span className="font-open-sans text-sm font-semibold text-gray">
        Illuminate Nights
      </span>
      <ChevronRight className="size-3.5 rotate-0 text-gray" />
      <span className="font-open-sans text-sm font-semibold text-black">
        Seat map
      </span>
    </div>
  );
}

// View Event link
function ViewEventLink() {
  return (
    <Link
      href="/organizer/event"
      className="flex items-center gap-2 font-outfit text-sm font-bold text-tp-blue transition-opacity duration-200 ease hover:opacity-80"
    >
      View Event
      <ExternalLink className="size-4" />
    </Link>
  );
}

// Main seatmap display component
export function SeatmapDisplay() {
  return (
    <div className="flex flex-1 flex-col gap-8 px-8 py-5">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Breadcrumb />
        <ViewEventLink />
      </div>

      {/* Seatmap Image */}
      <div className="flex flex-1 items-center justify-center">
        <div className="relative h-full w-full max-w-[970px]">
          <Image
            src="/seatmap.png"
            alt="Venue seatmap"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}
