import { cn } from "@/lib/utils";

export type TabType = "your-seats" | "browse";

interface Tab {
  value: TabType;
  label: string;
}

const tabs: Tab[] = [
  { value: "your-seats", label: "Selected" },
  { value: "browse", label: "All seats" },
];

interface SidebarTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function SidebarTabs({ activeTab, onTabChange }: SidebarTabsProps) {
  return (
    <div className="px-3">
      <div className="flex gap-1 rounded-[16px] bg-light-gray p-1">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => onTabChange(tab.value)}
            className={cn(
              "flex-1 rounded-[12px] py-1.5 md:text-sm text-base transition-all duration-200 ease cursor-pointer",
              activeTab === tab.value
                ? "bg-white text-foreground shadow-sm font-semibold"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
