// Main components
export { SeatManagementSidebar } from "./seat-management-sidebar";
export { SeatmapDisplay } from "./seatmap-display";

// Hooks
export { useSeatSettingsControls } from "./use-seat-settings-controls";
export type { SeatSettingsControlsSettings } from "./use-seat-settings-controls";
export { useViewport } from "./use-viewport";
export { useLassoSelection } from "./use-lasso-selection";

// Sub-components
export { ActionsFloatingBar } from "./actions-floating-bar";
export type { HoldState } from "./actions-floating-bar";
export { HoldModal } from "./hold-modal";
export { HoldsSection } from "./holds-section";
export { DeleteHoldModal } from "./delete-hold-modal";
export { SeatEditModal } from "./seat-edit-modal";
export { SelectedSeatsList } from "./selected-seats-list";
export { SeatmapLegend, PRICE_COLORS, getPriceColor } from "./seatmap-legend";
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
} from "./types";

// Constants
export { HOLD_COLORS } from "./types";
export { MIN_SCALE, MAX_SCALE } from "./seatmap-utils";

// Utilities
export { getSeatStatusColor, groupSeatsByRow } from "./seatmap-utils";
export type { Viewport } from "./seatmap-utils";

// Data
export { mockSections, mockHolds } from "./mock-data";
