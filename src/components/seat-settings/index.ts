// Main components
export { SeatManagementSidebar } from "./seat-management-sidebar";
export { SeatmapDisplay } from "./seatmap-display";

// Hooks
export { useSeatSettingsControls } from "./use-seat-settings-controls";
export type {
  SeatSettingsControlsSettings,
  LayoutVariant,
} from "./use-seat-settings-controls";
export { useViewport } from "./use-viewport";
export { useLassoSelection } from "./use-lasso-selection";

// Sub-components
export { ActionsFloatingBar } from "./actions-floating-bar";
export { BackButton } from "./back-button";
export type { HoldState } from "./actions-floating-bar";
export { HoldModal } from "./hold-modal";
export { HoldsSection } from "./holds-section";
export { DeleteHoldModal } from "./delete-hold-modal";
export { ReleaseHoldModal } from "./release-hold-modal";
export { MoveHoldModal } from "./move-hold-modal";
export type { MoveHoldInfo } from "./move-hold-modal";
export { SeatEditModal } from "./seat-edit-modal";
export { SelectedSeatsList } from "./selected-seats-list";
export {
  SeatmapLegend,
  createPriceColorMap,
  getPriceColor,
} from "./seatmap-legend";
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
  FeeOption,
  SelectionInfo,
} from "./types";

// Constants
export { HOLD_COLORS } from "./types";
export { MIN_SCALE, MAX_SCALE } from "./seatmap-utils";

// Utilities
export { getSeatStatusColor, groupSeatsByRow } from "./seatmap-utils";
export type { Viewport } from "./seatmap-utils";

// Data
export { mockSections, mockHolds, mockTables } from "./mock-data";

// Table layout components
export { TableBlock } from "./table-block";
export { TableSeatButton } from "./table-seat-button";
