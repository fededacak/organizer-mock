// Individual seat status for inventory tracking
export type SeatStatus = "on-sale" | "sold" | "held";

// Section-level status for sales management
export type SectionStatus = "on-sale" | "off-sale" | "sold-out";

// View mode for the seatmap display
export type ViewMode = "status" | "price";

// Hold type determines behavior and visibility
export type HoldType = "internal" | "password-protected";

// Complete hold configuration
export interface Hold {
  id: string;
  name: string; // e.g., "VIP Guest List", "Sponsor Block"
  type: HoldType;
  password?: string; // Required if type is "password-protected"
  startDate?: Date; // Optional start date
  endDate?: Date; // Optional expiration date
  notes?: string; // Internal notes
  color: string; // Visual differentiation on seatmap
  createdAt: Date;
  seatIds: string[]; // Seats in this hold
}

// Pre-defined hold colors for visual differentiation
export const HOLD_COLORS = [
  { name: "Purple", value: "#8B5CF6", label: "VIP" },
  { name: "Blue", value: "#3B82F6", label: "Sponsors" },
  { name: "Teal", value: "#14B8A6", label: "Comps" },
  { name: "Amber", value: "#F59E0B", label: "Reserved" },
  { name: "Pink", value: "#EC4899", label: "Staff" },
] as const;

// Fee option type
export type FeeOption = "pass_to_buyer" | "absorb";

// Individual seat within a section
export interface Seat {
  id: string;
  row: string; // e.g., "A", "B", "1"
  number: string; // e.g., "1", "2", "101"
  status: SeatStatus;
  price: number; // Seat price
  feeOption: FeeOption; // How fees are handled
  holdId?: string; // Reference to Hold
}

// Section containing multiple seats
export interface Section {
  id: string;
  name: string; // e.g., "Section A", "Floor", "Balcony Left"
  status: SectionStatus;
  capacity: number; // Total seats in section
  available: number; // Seats still available
  color?: string; // For seatmap visualization
  seats: Seat[];
}
