"use client";

import { ArrowRight } from "lucide-react";
import { SectionHeader } from "./section-header";

export function AddonsSection() {
  return (
    <div className=" dark:border-[#2a2a35] flex flex-col">
      <SectionHeader title="Already got tickets?" />
      <button
        className="flex items-center gap-2 bg-light-gray dark:bg-[#1e1e26] px-5 py-2.5 rounded-[36px] w-fit cursor-pointer transition-colors duration-200 ease"
        onClick={() => {
          // Handle skip to add-ons action
          const addonsSection = document.getElementById("addons-anchor");
          if (addonsSection) {
            addonsSection.scrollIntoView({ behavior: "smooth" });
          }
        }}
      >
        <span className="font-bold text-sm text-black dark:text-white">
          Skip To Add-Ons
        </span>
        <ArrowRight className="w-4 h-4 text-dark-gray/60 dark:text-[#9ca3af]" />
      </button>
    </div>
  );
}
