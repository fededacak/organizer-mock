// Main components
export { SeatManagementSidebar } from "./seat-management-sidebar";
export { SeatmapDisplay } from "./seatmap-display";

// Hooks
export { useSeatSettingsControls } from "./use-seat-settings-controls";
export type { SeatSettingsControlsSettings } from "./use-seat-settings-controls";

// Sub-components
export { ActionsFloatingBar } from "./actions-floating-bar";
export { HoldModal } from "./hold-modal";
export { SeatEditModal } from "./seat-edit-modal";
export { SelectedSeatsList } from "./selected-seats-list";
export { SeatmapLegend, PRICE_COLORS, getPriceColor } from "./seatmap-legend";
export { ViewModeToggle } from "./view-mode-toggle";
export { ZoomControls } from "./zoom-controls";

// Types
export type {
  Seat,
  SeatStatus,
  Section,
  SectionStatus,
  ViewMode,
  Hold,
  HoldType,
  ReleaseAction,
} from "./types";

// Constants
export { HOLD_COLORS } from "./types";

// Data
export { mockSections, mockHolds } from "./mock-data";
