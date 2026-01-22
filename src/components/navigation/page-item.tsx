import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";
import type { FolderItem, FolderColor } from "./types";
import { PAGE_ICON_COLORS } from "./constants";

type PageItemProps = {
  item: FolderItem;
  color: FolderColor;
};

export function PageItem({ item, color }: PageItemProps) {
  const iconColors = PAGE_ICON_COLORS[color];

  return (
    <Link
      href={item.href}
      className="
        group
        flex items-center gap-3 px-4 py-3
        rounded-[14px]
        transition-colors duration-200 ease
        hover:bg-light-gray
      "
    >
      {/* File Icon */}
      <div
        className={`w-9 h-9 rounded-[10px] ${iconColors.bg} flex items-center justify-center`}
      >
        <FileText
          className={`w-[18px] h-[18px] ${iconColors.icon}`}
          strokeWidth={2}
        />
      </div>

      {/* Page Name */}
      <span className="flex-1 text-base font-medium text-black">
        {item.name}
      </span>

      {/* Arrow on Hover */}
      <ArrowRight
        className={`w-4 h-4 ${iconColors.icon} opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease`}
        strokeWidth={2}
      />
    </Link>
  );
}
