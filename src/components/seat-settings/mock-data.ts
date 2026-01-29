import type { Section, Seat, SeatStatus } from "./types";

// Helper to generate seats for a section
function generateSeats(
  sectionPrefix: string,
  rows: number,
  seatsPerRow: number,
  soldPercentage: number = 0.2,
  reservedPercentage: number = 0.05,
  heldPercentage: number = 0.02
): Seat[] {
  const seats: Seat[] = [];
  const rowLabels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (let r = 0; r < rows; r++) {
    const rowLabel = rowLabels[r] || `${r + 1}`;
    for (let s = 1; s <= seatsPerRow; s++) {
      const random = Math.random();
      let status: SeatStatus = "available";

      if (random < soldPercentage) {
        status = "sold";
      } else if (random < soldPercentage + reservedPercentage) {
        status = "reserved";
      } else if (random < soldPercentage + reservedPercentage + heldPercentage) {
        status = "held";
      }

      seats.push({
        id: `${sectionPrefix}-${rowLabel}${s}`,
        row: rowLabel,
        number: `${s}`,
        status,
      });
    }
  }

  return seats;
}

// Floor: 10 rows, 12 seats each = 120 seats
const floorSeats = generateSeats("floor", 10, 12, 0.28, 0.05, 0.02);
const floorSold = floorSeats.filter((s) => s.status === "sold").length;

// Balcony Left: 2 rows, 6 seats each = 12 seats
const balconyLeftSeats = generateSeats("bl", 2, 6, 0.1, 0.05, 0.02);
const balconyLeftSold = balconyLeftSeats.filter((s) => s.status === "sold").length;

// Balcony Right: 2 rows, 6 seats each = 12 seats (sold out)
const balconyRightSeats = generateSeats("br", 2, 6, 1, 0, 0); // 100% sold
const balconyRightSold = balconyRightSeats.filter((s) => s.status === "sold").length;

// VIP Box: 2 rows, 5 seats each = 10 seats
const vipSeats = generateSeats("vip", 2, 5, 0.4, 0.1, 0.1);
const vipSold = vipSeats.filter((s) => s.status === "sold").length;

// Upper Deck: 4 rows, 10 seats each = 40 seats (off-sale, all available)
const upperDeckSeats = generateSeats("ud", 4, 10, 0, 0, 0);

export const mockSections: Section[] = [
  {
    id: "section-floor",
    name: "Floor",
    price: 150,
    status: "on-sale",
    capacity: 120,
    available: 120 - floorSold,
    color: "#4F46E5",
    seats: floorSeats,
  },
  {
    id: "section-balcony-left",
    name: "Balcony Left",
    price: 75,
    status: "on-sale",
    capacity: 12,
    available: 12 - balconyLeftSold,
    color: "#0EA5E9",
    seats: balconyLeftSeats,
  },
  {
    id: "section-balcony-right",
    name: "Balcony Right",
    price: 75,
    status: "sold-out",
    capacity: 12,
    available: 0,
    color: "#0EA5E9",
    seats: balconyRightSeats,
  },
  {
    id: "section-vip",
    name: "VIP Box",
    price: 250,
    status: "on-sale",
    capacity: 10,
    available: 10 - vipSold,
    color: "#F59E0B",
    seats: vipSeats,
  },
  {
    id: "section-upper-deck",
    name: "Upper Deck",
    price: 45,
    status: "off-sale",
    capacity: 40,
    available: 40,
    color: "#10B981",
    seats: upperDeckSeats,
  },
];

// Export seat grid dimensions for layout
export const sectionGridConfig: Record<string, { rows: number; seatsPerRow: number }> = {
  "section-floor": { rows: 10, seatsPerRow: 12 },
  "section-balcony-left": { rows: 2, seatsPerRow: 6 },
  "section-balcony-right": { rows: 2, seatsPerRow: 6 },
  "section-vip": { rows: 2, seatsPerRow: 5 },
  "section-upper-deck": { rows: 4, seatsPerRow: 10 },
};
