// Individual seat status for inventory tracking
export type SeatStatus = "available" | "sold" | "reserved" | "held";

// Section-level status for sales management
export type SectionStatus = "on-sale" | "off-sale" | "sold-out";

// Individual seat within a section
export interface Seat {
  id: string;
  row: string; // e.g., "A", "B", "1"
  number: string; // e.g., "1", "2", "101"
  status: SeatStatus;
  // Price inherited from section (no individual price)
}

// Section containing multiple seats
export interface Section {
  id: string;
  name: string; // e.g., "Section A", "Floor", "Balcony Left"
  price: number; // Section-level pricing
  status: SectionStatus;
  capacity: number; // Total seats in section
  available: number; // Seats still available
  color?: string; // For seatmap visualization
  seats: Seat[];
}
