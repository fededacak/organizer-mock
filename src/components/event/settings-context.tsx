"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export interface EventSettings {
  // General
  eventType: "single" | "multi";
  showEndTime: boolean;
  locationTBD: boolean;
  ticketCount: 1 | 2 | 6;
  // Sections
  description: "none" | "short" | "long";
  youtubeVideoCount: 0 | 1 | 2;
  showLineup: boolean;
  showSpotify: boolean;
  showAddons: boolean;
  showSponsors: boolean;
  // Display
  theme: "light" | "dark";
  imageCount: 0 | 1 | 3;
}

const DEFAULT_SETTINGS: EventSettings = {
  // General
  eventType: "single",
  showEndTime: false,
  locationTBD: false,
  ticketCount: 2,
  // Sections
  description: "long",
  youtubeVideoCount: 0,
  showLineup: false,
  showSpotify: true,
  showAddons: false,
  showSponsors: false,
  // Display
  theme: "light",
  imageCount: 3,
};

const STORAGE_KEY = "event-page-settings";

interface EventSettingsContextValue {
  settings: EventSettings;
  updateSettings: <K extends keyof EventSettings>(
    key: K,
    value: EventSettings[K]
  ) => void;
  resetSettings: () => void;
}

const EventSettingsContext = createContext<EventSettingsContextValue | null>(
  null
);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<EventSettings>(DEFAULT_SETTINGS);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      }
    } catch {
      // Ignore parse errors, use defaults
    }
    setIsHydrated(true);
  }, []);

  // Persist settings to localStorage on change
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      } catch {
        // Ignore storage errors
      }
    }
  }, [settings, isHydrated]);

  const updateSettings = <K extends keyof EventSettings>(
    key: K,
    value: EventSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <EventSettingsContext.Provider
      value={{ settings, updateSettings, resetSettings }}
    >
      {children}
    </EventSettingsContext.Provider>
  );
}

export function useEventSettings() {
  const context = useContext(EventSettingsContext);
  if (!context) {
    throw new Error("useEventSettings must be used within a SettingsProvider");
  }
  return context;
}
