"use client";

import { useControls, folder } from "leva";

export interface SeatSettingsControlsSettings {
  // Layout
  showSidebar: boolean;

  // Display
  seatSize: "small" | "medium" | "large";
  showRowLabels: boolean;
  showSeatNumbers: boolean;
  showStage: boolean;

  // Behavior
  selectionMode: "click" | "lasso" | "both";

  // Mock Data
  soldPercentage: number;
  heldPercentage: number;
}

export function useSeatSettingsControls(): SeatSettingsControlsSettings {
  const [settings] = useControls(() => ({
    Layout: folder({
      showSidebar: { value: true, label: "Show Sidebar" },
    }),
    Display: folder({
      seatSize: {
        value: "medium",
        options: ["small", "medium", "large"] as const,
      },
      showRowLabels: true,
      showSeatNumbers: false,
      showStage: true,
    }),
    Behavior: folder({
      selectionMode: {
        value: "both",
        options: ["click", "lasso", "both"] as const,
      },
    }),
    "Mock Data": folder({
      soldPercentage: { value: 0, min: 0, max: 100, step: 5 },
      heldPercentage: { value: 0, min: 0, max: 100, step: 5 },
    }),
  }));

  return settings as unknown as SeatSettingsControlsSettings;
}
