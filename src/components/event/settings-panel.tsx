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

export function SettingsPanel() {
  const { settings, updateSettings, resetSettings } = useEventSettings();
  const [open, setOpen] = useState(false);

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
        <SheetHeader className="border-b border-[#2a2a35] pb-4 sticky top-0 bg-background">
          <SheetTitle className="text-white text-lg">Event Settings</SheetTitle>
          <SheetDescription className="text-[#9ca3af] text-sm">
            Configure the event page layout and content
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-5 pb-5 px-4">
          {/* Theme */}
          <SettingGroup label="Theme">
            <SegmentedControl
              options={[
                { value: "light", label: "Light" },
                { value: "dark", label: "Dark" },
              ]}
              value={settings.theme}
              onChange={(v) => updateSettings("theme", v as "light" | "dark")}
            />
          </SettingGroup>

          {/* Location */}
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

          {/* Tickets */}
          <SettingGroup label="Ticket Types">
            <SegmentedControl
              options={[
                { value: "1", label: "1" },
                { value: "2", label: "2" },
                { value: "3", label: "3" },
              ]}
              value={String(settings.ticketCount)}
              onChange={(v) =>
                updateSettings("ticketCount", Number(v) as 1 | 2 | 3)
              }
            />
          </SettingGroup>

          {/* Description */}
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

          {/* Lineup */}
          <SettingGroup label="Lineup Section">
            <SegmentedControl
              options={[
                { value: "show", label: "Show" },
                { value: "hide", label: "Hide" },
              ]}
              value={settings.showLineup ? "show" : "hide"}
              onChange={(v) => updateSettings("showLineup", v === "show")}
            />
          </SettingGroup>

          {/* Spotify */}
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

          {/* Add-ons */}
          <SettingGroup label="Add-ons Section">
            <SegmentedControl
              options={[
                { value: "show", label: "Show" },
                { value: "hide", label: "Hide" },
              ]}
              value={settings.showAddons ? "show" : "hide"}
              onChange={(v) => updateSettings("showAddons", v === "show")}
            />
          </SettingGroup>

          {/* Images */}
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

          {/* Reset */}
          <button
            onClick={resetSettings}
            className="mt-2 flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-[#3a3a45] text-sm text-[#9ca3af] hover:text-white hover:border-[#6b7280] transition-colors duration-200 ease cursor-pointer font-semibold"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to defaults
          </button>
        </div>
      </SheetContent>
    </Sheet>
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
