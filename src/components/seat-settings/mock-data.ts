import type { Section, Seat, SeatStatus, Hold } from "./types";
import { HOLD_COLORS } from "./types";

// Sample holds - these will be associated with specific seats
export const mockHolds: Hold[] = [];

// Create a map for quick holdId lookup
const seatToHoldMap = new Map<string, string>();
mockHolds.forEach((hold) => {
  hold.seatIds.forEach((seatId) => {
    seatToHoldMap.set(seatId, hold.id);
  });
});

// Helper to generate seats for a section
function generateSeats(
  sectionPrefix: string,
  rows: number,
  seatsPerRow: number,
  price: number,
  soldPercentage: number = 0.2,
  heldPercentage: number = 0.02
): Seat[] {
  const seats: Seat[] = [];
  const rowLabels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (let r = 0; r < rows; r++) {
    const rowLabel = rowLabels[r] || `${r + 1}`;
    for (let s = 1; s <= seatsPerRow; s++) {
      const seatId = `${sectionPrefix}-${rowLabel}${s}`;
      const holdId = seatToHoldMap.get(seatId);

      // If seat has a holdId, it's held
      if (holdId) {
        seats.push({
          id: seatId,
          row: rowLabel,
          number: `${s}`,
          status: "held",
          price,
          feeOption: "pass_to_buyer",
          holdId,
        });
        continue;
      }

      const random = Math.random();
      let status: SeatStatus = "on-sale";

      if (random < soldPercentage) {
        status = "sold";
      } else if (random < soldPercentage + heldPercentage) {
        status = "held";
      }

      seats.push({
        id: seatId,
        row: rowLabel,
        number: `${s}`,
        status,
        price,
        feeOption: "pass_to_buyer",
      });
    }
  }

  return seats;
}

// Floor: 10 rows, 12 seats each = 120 seats, $150 per seat
const floorSeats = generateSeats("floor", 10, 12, 150, 0.28, 0);
const floorSold = floorSeats.filter((s) => s.status === "sold").length;

// Balcony Left: 2 rows, 6 seats each = 12 seats, $75 per seat
const balconyLeftSeats = generateSeats("bl", 2, 6, 75, 0.1, 0);
const balconyLeftSold = balconyLeftSeats.filter(
  (s) => s.status === "sold"
).length;

// Balcony Right: 2 rows, 6 seats each = 12 seats (sold out), $75 per seat
const balconyRightSeats = generateSeats("br", 2, 6, 75, 1, 0); // 100% sold
const balconyRightSold = balconyRightSeats.filter(
  (s) => s.status === "sold"
).length;

// VIP Box: 2 rows, 5 seats each = 10 seats, $250 per seat
const vipSeats = generateSeats("vip", 2, 5, 250, 0.4, 0);
const vipSold = vipSeats.filter((s) => s.status === "sold").length;

// Upper Deck: 4 rows, 10 seats each = 40 seats (off-sale), $45 per seat
const upperDeckSeats = generateSeats("ud", 4, 10, 45, 0, 0);

export const mockSections: Section[] = [
  {
    id: "section-floor",
    name: "Floor",
    status: "on-sale",
    capacity: 120,
    available: 120 - floorSold,
    color: "#4F46E5",
    seats: floorSeats,
  },
  {
    id: "section-balcony-left",
    name: "Balcony Left",
    status: "on-sale",
    capacity: 12,
    available: 12 - balconyLeftSold,
    color: "#0EA5E9",
    seats: balconyLeftSeats,
  },
  {
    id: "section-balcony-right",
    name: "Balcony Right",
    status: "sold-out",
    capacity: 12,
    available: 0,
    color: "#0EA5E9",
    seats: balconyRightSeats,
  },
  {
    id: "section-vip",
    name: "VIP Box",
    status: "on-sale",
    capacity: 10,
    available: 10 - vipSold,
    color: "#F59E0B",
    seats: vipSeats,
  },
  {
    id: "section-upper-deck",
    name: "Upper Deck",
    status: "off-sale",
    capacity: 40,
    available: 40,
    color: "#10B981",
    seats: upperDeckSeats,
  },
];

// Export seat grid dimensions for layout
export const sectionGridConfig: Record<
  string,
  { rows: number; seatsPerRow: number }
> = {
  "section-floor": { rows: 10, seatsPerRow: 12 },
  "section-balcony-left": { rows: 2, seatsPerRow: 6 },
  "section-balcony-right": { rows: 2, seatsPerRow: 6 },
  "section-vip": { rows: 2, seatsPerRow: 5 },
  "section-upper-deck": { rows: 4, seatsPerRow: 10 },
};

// ============================================
// TABLE LAYOUT MOCK DATA
// ============================================

// Helper to generate seats for a table (arranged in a circle)
function generateTableSeats(
  tableNumber: number,
  seatsCount: number,
  price: number,
  soldPercentage: number = 0.2
): Seat[] {
  const seats: Seat[] = [];

  for (let s = 1; s <= seatsCount; s++) {
    const seatId = `table-${tableNumber}-${s}`;
    const random = Math.random();
    let status: SeatStatus = "on-sale";

    if (random < soldPercentage) {
      status = "sold";
    }

    seats.push({
      id: seatId,
      row: `${tableNumber}`, // Table number as row
      number: `${s}`, // Seat position around table
      status,
      price,
      feeOption: "pass_to_buyer",
    });
  }

  return seats;
}

// Table colors for visual variety
const TABLE_COLORS = [
  "#4F46E5", // Indigo
  "#0EA5E9", // Sky
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EC4899", // Pink
  "#8B5CF6", // Violet
];

// Generate 12 tables with varying seat counts and prices
function generateMockTables(): Section[] {
  const tables: Section[] = [];

  // Front row tables (closer to stage) - 4 tables, 6 seats each, higher price
  for (let i = 1; i <= 4; i++) {
    const seats = generateTableSeats(i, 6, 200, 0.3);
    const sold = seats.filter((s) => s.status === "sold").length;
    tables.push({
      id: `table-${i}`,
      name: `Table ${i}`,
      status: "on-sale",
      capacity: 6,
      available: 6 - sold,
      color: TABLE_COLORS[(i - 1) % TABLE_COLORS.length],
      seats,
    });
  }

  // Middle row tables - 4 tables, 8 seats each, medium price
  for (let i = 5; i <= 8; i++) {
    const seats = generateTableSeats(i, 8, 150, 0.2);
    const sold = seats.filter((s) => s.status === "sold").length;
    tables.push({
      id: `table-${i}`,
      name: `Table ${i}`,
      status: "on-sale",
      capacity: 8,
      available: 8 - sold,
      color: TABLE_COLORS[(i - 1) % TABLE_COLORS.length],
      seats,
    });
  }

  // Back row tables - 4 tables, 10 seats each, lower price
  for (let i = 9; i <= 12; i++) {
    const seats = generateTableSeats(i, 10, 100, 0.15);
    const sold = seats.filter((s) => s.status === "sold").length;
    tables.push({
      id: `table-${i}`,
      name: `Table ${i}`,
      status: "on-sale",
      capacity: 10,
      available: 10 - sold,
      color: TABLE_COLORS[(i - 1) % TABLE_COLORS.length],
      seats,
    });
  }

  return tables;
}

export const mockTables: Section[] = generateMockTables();
