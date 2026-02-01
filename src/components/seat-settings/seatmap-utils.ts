import type { Seat } from "./types";

// Viewport type for zoom/pan state
export type Viewport = {
  x: number;
  y: number;
  scale: number;
};

// Zoom constraints
export const MIN_SCALE = 0.25;
export const MAX_SCALE = 4;

/**
 * Get status color for individual seats (status view)
 * If seat is held and has a holdColor, that takes priority
 */
export function getSeatStatusColor(
  status: Seat["status"],
  holdColor?: string,
): string {
  if (status === "held" && holdColor) {
    return ""; // Use inline style for hold color
  }
  switch (status) {
    case "on-sale":
      return "bg-white";
    case "sold":
      return "bg-gray-400";
    case "held":
      return "bg-red-400"; // Fallback for holds without color
    default:
      return "bg-white";
  }
}

/**
 * Group seats by row for display purposes
 */
export function groupSeatsByRow(seats: Seat[]): Map<string, Seat[]> {
  const rows = new Map<string, Seat[]>();
  for (const seat of seats) {
    const existing = rows.get(seat.row) || [];
    existing.push(seat);
    rows.set(seat.row, existing);
  }
  return rows;
}
