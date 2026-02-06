import { ChevronsUpDown } from "lucide-react";

interface EventCardProps {
  eventName?: string;
  eventDate?: string;
  eventStatus?: "Public" | "Private" | "Draft";
}

export function EventCard({
  eventName = "Illuminate Nights",
  eventDate = "Apr 12, 7:00 PM",
  eventStatus = "Public",
}: EventCardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-[#f2f2f2] bg-white p-3 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.06)]">
      <div className="flex flex-col gap-0.5">
        <span className="font-outfit text-sm font-extrabold text-black">
          {eventName}
        </span>
        <span className="font-open-sans text-xs text-dark-gray">
          {eventDate}
        </span>
      </div>
      {/* Status Select */}
      <button className="flex items-center justify-between rounded-[10px] border border-[#e5e5e5] bg-white p-2 transition-colors duration-200 ease hover:bg-light-gray/30">
        <div className="flex items-center gap-1.5">
          <div className="size-2 rounded-full bg-tp-green" />
          <span className="font-open-sans text-xs font-semibold text-black">
            {eventStatus}
          </span>
        </div>
        <ChevronsUpDown className="size-3 text-gray opacity-80" />
      </button>
    </div>
  );
}
