import Link from "next/link";
import { Globe } from "lucide-react";
import type { FolderItem, FolderColor } from "./types";
import { PAGE_ICON_COLORS } from "./constants";

type PageCardProps = {
  item: FolderItem;
  color: FolderColor;
};

export function PageCard({ item, color }: PageCardProps) {
  const iconColors = PAGE_ICON_COLORS[color];

  return (
    <Link
      href={item.href}
      className={`
        group
        flex flex-col gap-2 p-2
        rounded-[16px]
        bg-white
        border border-gray-100
        transition-all duration-200 ease
        active:scale-[0.98]
        ${iconColors.hoverBorder}
      `}
    >
      {/* File Icon */}
      <div
        className={`w-full h-[80px] sm:h-[120px] rounded-[10px] ${iconColors.bg} flex items-center justify-center`}
      >
        <Globe className={`w-7 h-7 ${iconColors.icon} `} strokeWidth={1.8} />
      </div>

      {/* Page Name */}
      <span className="md:text-sm text-base font-medium text-black ml-2 mb-1">
        {item.name}
      </span>
    </Link>
  );
}
