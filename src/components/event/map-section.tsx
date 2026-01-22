import { MapPin } from "lucide-react";
import type { Venue } from "./types";

interface MapSectionProps {
  venue: Venue;
}

export function MapSection({ venue }: MapSectionProps) {
  return (
    <section className="pb-4 border-b border-light-gray dark:border-[#2a2a35] md:border-none">
      <p className="font-extrabold text-sm text-black dark:text-white">
        {venue.name}
      </p>
      <p className="text-sm text-dark-gray dark:text-[#9ca3af] mt-1">{venue.address}</p>
      {/* Static Map Placeholder */}
      <div className="mt-2.5 w-full h-36 rounded-2xl bg-light-gray dark:bg-[#1e1e26] overflow-hidden relative">
        {/* Map background image */}
        <img
          src="/map.png"
          alt="Map location"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-tp-red flex items-center justify-center shadow-lg">
            <MapPin className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </section>
  );
}
