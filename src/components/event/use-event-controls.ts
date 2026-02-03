"use client";

import { useEffect, useRef } from "react";
import { useControls, folder } from "leva";

export type LayoutVariant = "luma" | "airbnb";

export type BannerStyle = "carousel" | "grid";

export interface EventControlsSettings {
  // General
  eventType: "single" | "multi";
  showEndTime: boolean;
  locationTBD: boolean;
  ticketCount: 0 | 1 | 2 | 6;
  // Seated
  showSeatedTicket: boolean;
  // Sections
  description: "none" | "short" | "long";
  youtubeVideoCount: 0 | 1 | 2;
  showLineup: boolean;
  showSpotify: boolean;
  showAddons: boolean;
  showSponsors: boolean;
  // Lineup (Artist Modal)
  lineupHasDescription: boolean;
  lineupHasSpotify: boolean;
  lineupHasYouTube: boolean;
  lineupHasInstagram: boolean;
  lineupHasTiktok: boolean;
  // Appearance
  layoutVariant: LayoutVariant;
  bannerStyle: BannerStyle;
  theme: "light" | "dark";
  imageCount: 0 | 1 | 2 | 3;
  primaryColor: "blue" | "purple" | "pink" | "orange" | "green" | "red";
}

const LAYOUT_BANNER_DEFAULTS: Record<LayoutVariant, BannerStyle> = {
  luma: "carousel",
  airbnb: "grid",
};

export function useEventControls(): EventControlsSettings {
  const [settings, set] = useControls(() => ({
    General: folder({
      eventType: { value: "single", options: ["single", "multi"] as const },
      showEndTime: false,
      locationTBD: false,
      ticketCount: { value: 2, options: [0, 1, 2, 6] as const },
    }),
    Seated: folder({
      showSeatedTicket: { value: false, label: "Show Seated Ticket" },
    }),
    Sections: folder({
      description: {
        value: "long",
        options: ["none", "short", "long"] as const,
      },
      youtubeVideoCount: { value: 0, options: [0, 1, 2] as const },
      showLineup: false,
      showSpotify: true,
      showAddons: false,
      showSponsors: false,
    }),
    Lineup: folder({
      lineupHasDescription: { value: true, label: "Has Description" },
      lineupHasSpotify: { value: true, label: "Has Spotify" },
      lineupHasYouTube: { value: true, label: "Has YouTube" },
      lineupHasInstagram: { value: true, label: "Has Instagram" },
      lineupHasTiktok: { value: true, label: "Has TikTok" },
    }),
    Appearance: folder({
      layoutVariant: {
        value: "luma",
        options: ["luma", "airbnb"] as const,
      },
      bannerStyle: {
        value: "carousel",
        options: ["carousel", "grid"] as const,
      },
      theme: { value: "light", options: ["light", "dark"] as const },
      imageCount: { value: 3, options: [0, 1, 2, 3] as const },
      primaryColor: {
        value: "blue",
        options: ["blue", "purple", "pink", "orange", "green", "red"] as const,
      },
    }),
  }));

  // Track previous layout to detect layout changes
  const prevLayoutVariant = useRef(settings.layoutVariant);

  // Sync bannerStyle when layoutVariant changes
  useEffect(() => {
    if (prevLayoutVariant.current !== settings.layoutVariant) {
      const defaultBannerStyle =
        LAYOUT_BANNER_DEFAULTS[settings.layoutVariant as LayoutVariant];
      set({ bannerStyle: defaultBannerStyle });
      prevLayoutVariant.current = settings.layoutVariant;
    }
  }, [settings.layoutVariant, set]);

  // Cast to proper types since Leva returns broader types for numeric options
  return settings as unknown as EventControlsSettings;
}
