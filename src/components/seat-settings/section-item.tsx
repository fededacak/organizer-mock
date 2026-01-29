"use client";

import { cn } from "@/lib/utils";
import type { Section, SectionStatus } from "./types";
import { Checkbox } from "./checkbox";

// Status badge for sections
function SectionStatusBadge({ status }: { status: SectionStatus }) {
  const statusConfig = {
    "on-sale": {
      label: "On Sale",
      dotColor: "bg-tp-green",
      textColor: "text-status-green",
      bgColor: "bg-tp-green/15",
    },
    "off-sale": {
      label: "Off Sale",
      dotColor: "bg-gray",
      textColor: "text-gray",
      bgColor: "bg-gray/15",
    },
    "sold-out": {
      label: "Sold Out",
      dotColor: "bg-tp-red",
      textColor: "text-status-red",
      bgColor: "bg-tp-red/15",
    },
  };

  const config = statusConfig[status];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full",
        config.bgColor,
      )}
    >
      <div className={cn("w-2 h-2 rounded-full", config.dotColor)} />
      <span className={cn("text-xs font-semibold", config.textColor)}>
        {config.label}
      </span>
    </div>
  );
}

interface SectionItemProps {
  section: Section;
  isSelected: boolean;
  onToggle: () => void;
}

export function SectionItem({
  section,
  isSelected,
  onToggle,
}: SectionItemProps) {
  return (
    <div
      onClick={onToggle}
      className={cn(
        "flex w-full items-center gap-4 rounded-[14px] border bg-white px-4 py-3 pl-3 text-left transition-colors duration-200 ease cursor-pointer",
        isSelected
          ? "border-tp-blue bg-tp-blue/5"
          : "border-border hover:bg-light-gray",
      )}
    >
      {/* <Checkbox checked={isSelected} onChange={onToggle} /> */}

      {/* Color indicator */}
      <div
        className="h-full w-2 shrink-0 rounded-full"
        style={{ backgroundColor: section.color }}
      />

      <div className="flex flex-1 flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <span className="font-outfit text-base font-bold text-black">
            {section.name}
          </span>
          <span className="font-outfit text-base font-bold text-black">
            ${section.price}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <SectionStatusBadge status={section.status} />
          <span className="font-outfit text-xs text-dark-gray">
            {section.capacity - section.available}/{section.capacity} sold
          </span>
        </div>
      </div>
    </div>
  );
}
