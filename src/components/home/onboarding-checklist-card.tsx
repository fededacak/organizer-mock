"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingChecklistCardProps {
  progress?: number;
  className?: string;
}

export function OnboardingChecklistCard({
  progress = 17,
  className,
}: OnboardingChecklistCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <button
      onClick={() => setIsExpanded(!isExpanded)}
      className={cn(
        "flex w-full cursor-pointer flex-col items-start rounded-[20px] bg-white p-6 text-left shadow-card transition-shadow duration-200 ease hover:shadow-lg",
        className
      )}
    >
      <div className="flex w-full flex-col gap-4">
        <div className="flex w-full flex-col gap-6">
          {/* Title row */}
          <div className="flex w-full items-start gap-5">
            <div className="flex flex-1 items-center gap-4">
              <h2 className="font-outfit text-lg font-extrabold capitalize text-black">
                Next steps based on your profile
              </h2>
              <div
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full bg-light-gray transition-transform duration-200 ease",
                  isExpanded && "rotate-180"
                )}
              >
                <ChevronDown className="size-4 text-gray" />
              </div>
            </div>
            <div className="flex h-[25px] items-center justify-center rounded-full bg-tp-green px-2.5 py-1">
              <span className="font-outfit text-xs font-extrabold text-white">
                RECOMMENDED
              </span>
            </div>
          </div>

          {/* Progress row */}
          <div className="flex w-full items-center gap-3">
            <span className="font-outfit text-base font-bold text-tp-blue">
              {progress}% completed
            </span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-light-gray">
              <div
                className="h-full rounded-full bg-tp-blue transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

