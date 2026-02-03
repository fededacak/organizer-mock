import type { Section, Seat, SeatStatus, Hold } from "../seat-settings/types";

// Consumer-specific holds with passwords
export const consumerHolds: Hold[] = [
  {
    id: "hold-vip-presale",
    name: "VIP Pre-sale",
    type: "password-protected",
    password: "VIP123",
    color: "#F59E0B", // Amber
    createdAt: new Date("2026-01-15"),
    seatIds: [
      // Floor section - rows A and B, seats 5-8
      "floor-A5",
      "floor-A6",
      "floor-A7",
      "floor-A8",
      "floor-B5",
      "floor-B6",
      "floor-B7",
      "floor-B8",
    ],
  },
  {
    id: "hold-sponsor",
    name: "Sponsor Access",
    type: "password-protected",
    password: "SPONSOR",
    color: "#F59E0B", // Amber
    createdAt: new Date("2026-01-15"),
    seatIds: [
      // VIP Box - all seats
      "vip-A1",
      "vip-A2",
      "vip-A3",
      "vip-A4",
      "vip-A5",
      "vip-B1",
      "vip-B2",
      "vip-B3",
      "vip-B4",
      "vip-B5",
    ],
  },
  {
    id: "hold-staff",
    name: "Staff Reserved",
    type: "internal",
    color: "#6B7280", // Grey
    createdAt: new Date("2026-01-15"),
    seatIds: [
      // Upper Deck - row A
      "ud-A1",
      "ud-A2",
      "ud-A3",
      "ud-A4",
      "ud-A5",
      "ud-A6",
      "ud-A7",
      "ud-A8",
      "ud-A9",
      "ud-A10",
    ],
  },
];

// Create a map for quick holdId lookup
const seatToHoldMap = new Map<string, string>();
consumerHolds.forEach((hold) => {
  hold.seatIds.forEach((seatId) => {
    seatToHoldMap.set(seatId, hold.id);
  });
});

// Seeded random number generator for consistent results
function seededRandom(seed: number): () => number {
  return function () {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
}

// Helper to generate seats for a section with deterministic "sold" seats
function generateConsumerSeats(
  sectionPrefix: string,
  rows: number,
  seatsPerRow: number,
  price: number,
  soldPercentage: number = 0.25,
  seed: number = 42
): Seat[] {
  const seats: Seat[] = [];
  const rowLabels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const random = seededRandom(seed);

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

      // Deterministic "sold" assignment
      const randomValue = random();
      const status: SeatStatus =
        randomValue < soldPercentage ? "sold" : "on-sale";

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
const floorSeats = generateConsumerSeats("floor", 10, 12, 150, 0.25, 100);
const floorSold = floorSeats.filter((s) => s.status === "sold").length;

// Balcony Left: 2 rows, 6 seats each = 12 seats, $75 per seat
const balconyLeftSeats = generateConsumerSeats("bl", 2, 6, 75, 0.2, 200);
const balconyLeftSold = balconyLeftSeats.filter(
  (s) => s.status === "sold"
).length;

// Balcony Right: 2 rows, 6 seats each = 12 seats, $75 per seat (mostly sold)
const balconyRightSeats = generateConsumerSeats("br", 2, 6, 75, 0.8, 300);
const balconyRightSold = balconyRightSeats.filter(
  (s) => s.status === "sold"
).length;

// VIP Box: 2 rows, 5 seats each = 10 seats, $250 per seat (all held by sponsor)
const vipSeats = generateConsumerSeats("vip", 2, 5, 250, 0, 400);
const vipSold = vipSeats.filter((s) => s.status === "sold").length;

// Upper Deck: 4 rows, 10 seats each = 40 seats, $45 per seat
const upperDeckSeats = generateConsumerSeats("ud", 4, 10, 45, 0.15, 500);
const upperDeckSold = upperDeckSeats.filter((s) => s.status === "sold").length;

export const consumerSections: Section[] = [
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
    status: "on-sale",
    capacity: 12,
    available: 12 - balconyRightSold,
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
    status: "on-sale",
    capacity: 40,
    available: 40 - upperDeckSold,
    color: "#10B981",
    seats: upperDeckSeats,
  },
];

// Helper to get hold by seat ID
export function getHoldForSeat(seatId: string): Hold | undefined {
  const holdId = seatToHoldMap.get(seatId);
  if (!holdId) return undefined;
  return consumerHolds.find((h) => h.id === holdId);
}
