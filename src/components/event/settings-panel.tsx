"use client";

import { useState } from "react";
import { Pickaxe, RotateCcw } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useEventSettings } from "./settings-context";

type TabId = "general" | "sections" | "appearance";

const TABS: { id: TabId; label: string }[] = [
  { id: "general", label: "General" },
  { id: "sections", label: "Sections" },
  { id: "appearance", label: "Appearance" },
];

export function SettingsPanel() {
  const { settings, updateSettings, resetSettings } = useEventSettings();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("general");

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-4 lg:bottom-6 lg:right-6 z-50 w-12 h-12 rounded-full bg-[#1a1a1f] text-white flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-200 ease-out"
        aria-label="Open event settings"
      >
        <Pickaxe className="w-5 h-5" />
      </button>
      <SheetContent
        side="right"
        className="dark bg-[#0a0a0f] border-[#2a2a35] text-white w-[320px] sm:w-[500px] sm:max-w-[400px]! overflow-y-auto mr-2 my-2 max-h-[calc(100vh-16px)] rounded-[16px] gap-0"
      >
        <SheetHeader className="pb-0 sticky top-0 bg-[#0a0a0f] z-5">
          <SheetTitle className="text-white text-lg">Event Settings</SheetTitle>
          <SheetDescription className="text-[#9ca3af] text-sm">
            Configure the event page layout and content
          </SheetDescription>
          <TabsNav activeTab={activeTab} onTabChange={setActiveTab} />
        </SheetHeader>

        <div className="flex flex-col gap-5 pb-20 px-4">
          {/* General Tab */}
          {activeTab === "general" && (
            <>
              <SettingGroup label="Event Type">
                <SegmentedControl
                  options={[
                    { value: "single", label: "Single Day" },
                    { value: "multi", label: "Multi Day" },
                  ]}
                  value={settings.eventType}
                  onChange={(v) =>
                    updateSettings("eventType", v as "single" | "multi")
                  }
                />
              </SettingGroup>

              <SettingGroup label="End Time">
                <SegmentedControl
                  options={[
                    { value: "show", label: "Show" },
                    { value: "hide", label: "Hide" },
                  ]}
                  value={settings.showEndTime ? "show" : "hide"}
                  onChange={(v) => updateSettings("showEndTime", v === "show")}
                />
              </SettingGroup>

              <SettingGroup label="Location">
                <SegmentedControl
                  options={[
                    { value: "venue", label: "Venue" },
                    { value: "tbd", label: "TBD" },
                  ]}
                  value={settings.locationTBD ? "tbd" : "venue"}
                  onChange={(v) => updateSettings("locationTBD", v === "tbd")}
                />
              </SettingGroup>

              <SettingGroup label="Ticket Types">
                <SegmentedControl
                  options={[
                    { value: "1", label: "1" },
                    { value: "2", label: "2" },
                    { value: "6", label: "6" },
                  ]}
                  value={String(settings.ticketCount)}
                  onChange={(v) =>
                    updateSettings("ticketCount", Number(v) as 1 | 2 | 6)
                  }
                />
              </SettingGroup>
            </>
          )}

          {/* Sections Tab */}
          {activeTab === "sections" && (
            <>
              <SettingGroup label="Description">
                <SegmentedControl
                  options={[
                    { value: "none", label: "None" },
                    { value: "short", label: "Short" },
                    { value: "long", label: "Long" },
                  ]}
                  value={settings.description}
                  onChange={(v) =>
                    updateSettings("description", v as "none" | "short" | "long")
                  }
                />
              </SettingGroup>

              <SettingGroup label="YouTube Videos">
                <SegmentedControl
                  options={[
                    { value: "0", label: "0" },
                    { value: "1", label: "1" },
                    { value: "2", label: "2" },
                  ]}
                  value={String(settings.youtubeVideoCount)}
                  onChange={(v) =>
                    updateSettings("youtubeVideoCount", Number(v) as 0 | 1 | 2)
                  }
                />
              </SettingGroup>

              <SettingGroup label="Lineup">
                <SegmentedControl
                  options={[
                    { value: "show", label: "Show" },
                    { value: "hide", label: "Hide" },
                  ]}
                  value={settings.showLineup ? "show" : "hide"}
                  onChange={(v) => updateSettings("showLineup", v === "show")}
                />
              </SettingGroup>

              <SettingGroup label="Spotify Playlist">
                <SegmentedControl
                  options={[
                    { value: "show", label: "Show" },
                    { value: "hide", label: "Hide" },
                  ]}
                  value={settings.showSpotify ? "show" : "hide"}
                  onChange={(v) => updateSettings("showSpotify", v === "show")}
                />
              </SettingGroup>

              <SettingGroup label="Add-ons">
                <SegmentedControl
                  options={[
                    { value: "show", label: "Show" },
                    { value: "hide", label: "Hide" },
                  ]}
                  value={settings.showAddons ? "show" : "hide"}
                  onChange={(v) => updateSettings("showAddons", v === "show")}
                />
              </SettingGroup>

              <SettingGroup label="Sponsors">
                <SegmentedControl
                  options={[
                    { value: "show", label: "Show" },
                    { value: "hide", label: "Hide" },
                  ]}
                  value={settings.showSponsors ? "show" : "hide"}
                  onChange={(v) => updateSettings("showSponsors", v === "show")}
                />
              </SettingGroup>
            </>
          )}

          {/* Display Tab */}
          {activeTab === "appearance" && (
            <>
              <SettingGroup label="Theme">
                <SegmentedControl
                  options={[
                    { value: "light", label: "Light" },
                    { value: "dark", label: "Dark" },
                  ]}
                  value={settings.theme}
                  onChange={(v) =>
                    updateSettings("theme", v as "light" | "dark")
                  }
                />
              </SettingGroup>

              <SettingGroup label="Banner Images">
                <SegmentedControl
                  options={[
                    { value: "0", label: "0" },
                    { value: "1", label: "1" },
                    { value: "3", label: "3" },
                  ]}
                  value={String(settings.imageCount)}
                  onChange={(v) =>
                    updateSettings("imageCount", Number(v) as 0 | 1 | 3)
                  }
                />
              </SettingGroup>
            </>
          )}

        </div>

        {/* Fixed Reset Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-[#0a0a0f] via-[#0a0a0f] to-transparent pt-8">
          <button
            onClick={resetSettings}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-[#3a3a45] text-sm text-[#9ca3af] hover:text-white hover:border-[#6b7280] transition-colors duration-200 ease cursor-pointer font-semibold"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to defaults
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function TabsNav({
  activeTab,
  onTabChange,
}: {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}) {
  return (
    <div className="flex gap-6 mt-4 border-b border-[#2a2a35]">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`pb-2 text-sm font-medium transition-colors duration-200 ease cursor-pointer relative ${
            activeTab === tab.id
              ? "text-white"
              : "text-[#6b7280] hover:text-[#9ca3af]"
          }`}
        >
          {tab.label}
          {activeTab === tab.id && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
          )}
        </button>
      ))}
    </div>
  );
}

function SettingGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  );
}

interface SegmentedControlOption {
  value: string;
  label: string;
}

function SegmentedControl({
  options,
  value,
  onChange,
}: {
  options: SegmentedControlOption[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex bg-[#1a1a1f] rounded-full p-1 gap-1">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`flex-1 px-3 py-1.5 text-sm font-semibold rounded-full transition-all duration-200 ease-out cursor-pointer ${
            value === option.value
              ? "bg-white text-black"
              : "text-[#9ca3af] hover:text-white"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
