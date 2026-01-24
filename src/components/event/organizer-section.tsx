import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "./section-header";
import type { Organizer } from "./types";

interface OrganizerSectionProps {
  organizer: Organizer;
  hideBorder?: boolean;
}

export function OrganizerSection({ organizer, hideBorder }: OrganizerSectionProps) {
  return (
    <section className={hideBorder ? "" : "border-b border-light-gray dark:border-[#2a2a35] pb-6 lg:pb-4"}>
      <SectionHeader title="Organized By" />
      <div className="bg-light-gray dark:bg-[#1e1e26] rounded-[20px] p-5 flex flex-col lg:flex-row items-center gap-4">
        {/* Avatar - larger on mobile */}
        <div className="w-20 h-20 lg:w-16 lg:h-16 rounded-full bg-mid-gray dark:bg-[#3a3a45] overflow-hidden shrink-0">
          <Image
            src={organizer.avatar}
            alt={organizer.name}
            width={80}
            height={80}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Content - centered on mobile, row layout on desktop */}
        <div className="flex-1 flex flex-col lg:flex-row items-center gap-4 lg:gap-3 w-full">
          <div className="flex-1 flex flex-col items-center lg:items-start gap-2 lg:gap-0">
            <p className="font-extrabold text-lg lg:text-base text-black dark:text-white">
              {organizer.name}
            </p>
            <div className="flex flex-col items-center lg:items-start gap-1 lg:gap-0">
              <p className="text-sm lg:text-xs text-muted-foreground dark:text-[#9ca3af]">
                <span className="font-extrabold">{organizer.eventsOrganized}</span>{" "}
                <span className="font-semibold">events organized</span>
              </p>
              <p className="text-sm lg:text-xs text-muted-foreground dark:text-[#9ca3af]">
                <span className="font-extrabold">{organizer.attendeesHosted}</span>{" "}
                <span className="font-semibold">attendees hosted</span>
              </p>
            </div>
          </div>
          <Button className="bg-black dark:bg-white hover:bg-black/90 dark:hover:bg-white/90 text-white dark:text-black font-bold text-base lg:text-sm rounded-[36px] px-4 py-2 h-auto w-fit">
            Follow
          </Button>
        </div>
      </div>
    </section>
  );
}
