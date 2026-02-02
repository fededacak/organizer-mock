"use client";

import { useControls } from "leva";

export type LayoutVariant = "sections" | "tables";

export interface SeatSettingsControlsSettings {
  layoutVariant: LayoutVariant;
}

export function useSeatSettingsControls(): SeatSettingsControlsSettings {
  const [settings] = useControls(() => ({
    layoutVariant: {
      value: "sections" as LayoutVariant,
      options: ["sections", "tables"] as const,
      label: "Layout Variant",
    },
  }));

  return settings as unknown as SeatSettingsControlsSettings;
}
