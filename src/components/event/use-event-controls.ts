"use client";

import { useControls, folder } from "leva";

export type LayoutVariant = "luma" | "airbnb";

export type BannerStyle = "carousel" | "grid";

export interface EventControlsSettings {
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
  // Appearance
  layoutVariant: LayoutVariant;
  bannerStyle: BannerStyle;
  theme: "light" | "dark";
  imageCount: 0 | 1 | 2 | 3;
  primaryColor: "blue" | "purple" | "pink" | "orange" | "green" | "red";
}

export function useEventControls(): EventControlsSettings {
  const settings = useControls({
    General: folder({
      eventType: { value: "single", options: ["single", "multi"] as const },
      showEndTime: false,
      locationTBD: false,
      ticketCount: { value: 2, options: [1, 2, 6] as const },
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
  });

  // Cast to proper types since Leva returns broader types for numeric options
  return settings as unknown as EventControlsSettings;
}
