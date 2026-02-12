"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ToggleTabsProps<T extends string> {
  tabs: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
}

export function ToggleTabs<T extends string>({
  tabs,
  value,
  onChange,
}: ToggleTabsProps<T>) {
  return (
    <div className="inline-flex items-center gap-0.5 rounded-[16px] bg-white p-1.5 w-fit">
      {tabs.map((tab) => {
        const isActive = value === tab.value;
        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={cn(
              "relative z-0 rounded-md px-4 h-[34px] font-outfit text-sm font-semibold transition-colors duration-200 ease",
              isActive
                ? " text-white"
                : "text-gray hover:text-black/50 cursor-pointer",
            )}
          >
            {isActive && (
              <motion.span
                layoutId="toggle-tab-indicator"
                className="absolute inset-0 rounded-[12px] bg-tp-blue shadow-sm"
                transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
