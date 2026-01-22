import type { FolderData, FolderColorConfig, PageIconColorConfig, FolderColor } from "./types";

export const FOLDERS: FolderData[] = [
  {
    id: "marketplace",
    name: "Marketplace",
    color: "coral",
    items: [{ id: "marketplace-home", name: "Home", href: "/marketplace/home" }],
  },
  {
    id: "organizer",
    name: "Organizer",
    color: "blue",
    items: [
      { id: "organizer-home", name: "Home", href: "/organizer/home" },
      { id: "organizer-event", name: "Event Page", href: "/organizer/event" },
      {
        id: "organizer-event-creation",
        name: "Event Creation",
        href: "/organizer/event-creation",
      },
      { id: "organizer-seatmap", name: "Seatmap", href: "/organizer/seatmap" },
    ],
  },
];

export const FOLDER_COLORS: Record<FolderColor, FolderColorConfig> = {
  coral: {
    bg: "bg-gradient-to-b from-[#FF7A5C] to-[#E85A3C]",
    tab: "bg-[#FF9580]",
    paper: "bg-white/90",
    paperLines: "bg-[#E85A3C]/30",
    border: "border-[#D64D30]/10",
  },
  blue: {
    bg: "bg-gradient-to-b from-[#5B8DEF] to-[#3D6FD9]",
    tab: "bg-[#7BA3F5]",
    paper: "bg-white/90",
    paperLines: "bg-[#3D6FD9]/30",
    border: "border-[#3562C8]/20",
  },
};

export const PAGE_ICON_COLORS: Record<FolderColor, PageIconColorConfig> = {
  coral: {
    bg: "bg-[#FF7A5C]/15",
    icon: "text-[#E85A3C]",
    hoverBorder: "hover:border-[#FF7A5C]",
  },
  blue: {
    bg: "bg-[#5B8DEF]/15",
    icon: "text-[#3D6FD9]",
    hoverBorder: "hover:border-[#5B8DEF]",
  },
};
