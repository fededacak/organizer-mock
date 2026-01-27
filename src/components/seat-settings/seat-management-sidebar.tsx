"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

// Types
type SeatStatus = "on-sale" | "sold" | "reserved";

interface Seat {
  id: string;
  name: string;
  status: SeatStatus;
  price: number;
}

// Mock data for seats
const mockSeats: Seat[] = [
  { id: "1", name: "Seat 110C", status: "on-sale", price: 15 },
  { id: "2", name: "Seat 111C", status: "on-sale", price: 15 },
  { id: "3", name: "Seat 112C", status: "on-sale", price: 15 },
  { id: "4", name: "Seat 112C", status: "on-sale", price: 15 },
  { id: "5", name: "Seat 112C", status: "on-sale", price: 15 },
  { id: "6", name: "Seat 112C", status: "on-sale", price: 15 },
  { id: "7", name: "Seat 112C", status: "on-sale", price: 15 },
  { id: "8", name: "Seat 112C", status: "on-sale", price: 15 },
  { id: "9", name: "Seat 112C", status: "on-sale", price: 15 },
];

// Checkbox component
function Checkbox({
  checked,
  onChange,
  className,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "size-[14px] shrink-0 rounded-[4px] border-[1.5px] transition-colors duration-200 ease",
        checked
          ? "border-tp-blue bg-tp-blue"
          : "border-gray bg-transparent hover:border-dark-gray",
        className
      )}
      aria-checked={checked}
      role="checkbox"
    >
      {checked && (
        <svg
          className="size-full text-white"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.5 4L5.5 10L2.5 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}

// Status badge component
function StatusBadge({ status }: { status: SeatStatus }) {
  const statusConfig = {
    "on-sale": { label: "On sale", dotColor: "bg-tp-green" },
    sold: { label: "Sold", dotColor: "bg-tp-red" },
    reserved: { label: "Reserved", dotColor: "bg-tp-orange" },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-2">
      <div className={cn("size-3 rounded-full", config.dotColor)} />
      <span className="font-outfit text-sm text-dark-gray">{config.label}</span>
    </div>
  );
}

// Seat item component
function SeatItem({
  seat,
  isSelected,
  onToggle,
}: {
  seat: Seat;
  isSelected: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex w-full items-center gap-4 rounded-2xl border border-border bg-white px-4 py-3">
      <Checkbox checked={isSelected} onChange={onToggle} />
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-center gap-3">
          <span className="font-outfit text-base font-bold text-black">
            {seat.name}
          </span>
          <StatusBadge status={seat.status} />
        </div>
        <span className="font-outfit text-sm text-dark-gray">
          Price: ${seat.price}
        </span>
      </div>
    </div>
  );
}

// Manage Event header pill
function ManageEventHeader() {
  return (
    <div className="flex h-[38px] items-center gap-2.5 rounded-full bg-white p-2">
      <div className="flex size-[22px] items-center justify-center rounded-full bg-mid-gray">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="11"
          height="9"
          viewBox="0 0 11 9"
          fill="none"
        >
          <path
            d="M3.62021 0.255247L0.320214 3.55525C0.115213 3.76025 0.000213377 4.04025 0.00021339 4.33025C0.000213402 4.62025 0.115213 4.90025 0.320214 5.10525L3.62021 8.40525C3.82021 8.64025 4.10521 8.77525 4.41521 8.79025C4.72521 8.80525 5.02022 8.68525 5.23522 8.47025C5.45022 8.25525 5.57022 7.95525 5.55522 7.65025C5.54522 7.34525 5.40521 7.05525 5.17021 6.85525L3.75021 5.43525L9.90022 5.43525C10.2952 5.43525 10.6552 5.22525 10.8552 4.88525C11.0502 4.54525 11.0502 4.12525 10.8552 3.78525C10.6602 3.44525 10.2952 3.23525 9.90022 3.23525L3.75021 3.23525L5.17021 1.81525C5.41521 1.53025 5.49521 1.14525 5.39021 0.790247C5.28521 0.430247 5.00521 0.155248 4.64521 0.045248C4.29021 -0.0597518 3.90021 0.0202488 3.62021 0.265249V0.255247Z"
            fill="white"
          />
        </svg>
      </div>
      <span className="font-outfit text-sm text-black">Manage Event</span>
    </div>
  );
}

// Search bar component for seats
function SeatSearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative flex w-full items-center gap-4 rounded-full border border-border bg-white px-4 py-3.5">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by ticket name"
        className="flex-1 bg-transparent font-outfit text-sm text-black placeholder:text-gray outline-none"
      />
      <button
        type="button"
        className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-tp-blue transition-transform duration-200 ease-out hover:scale-105 active:scale-95"
        aria-label="Search"
      >
        <Search className="size-4 text-white" strokeWidth={2} />
      </button>
    </div>
  );
}

// Select all header
function SelectAllHeader({
  isAllSelected,
  onToggleAll,
}: {
  isAllSelected: boolean;
  onToggleAll: () => void;
}) {
  return (
    <div className="flex h-[60px] items-center pl-4">
      <div className="flex items-center gap-4">
        <Checkbox checked={isAllSelected} onChange={onToggleAll} />
        <span className="font-outfit text-sm text-gray">Select All</span>
      </div>
    </div>
  );
}

// Main sidebar component
export function SeatManagementSidebar() {
  const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  // Filter seats based on search query
  const filteredSeats = useMemo(() => {
    if (!searchQuery.trim()) return mockSeats;
    const query = searchQuery.toLowerCase();
    return mockSeats.filter((seat) => seat.name.toLowerCase().includes(query));
  }, [searchQuery]);

  // Check if all filtered seats are selected
  const isAllSelected =
    filteredSeats.length > 0 &&
    filteredSeats.every((seat) => selectedSeats.has(seat.id));

  // Toggle single seat selection
  const toggleSeat = (seatId: string) => {
    setSelectedSeats((prev) => {
      const next = new Set(prev);
      if (next.has(seatId)) {
        next.delete(seatId);
      } else {
        next.add(seatId);
      }
      return next;
    });
  };

  // Toggle all seats selection
  const toggleAllSeats = () => {
    if (isAllSelected) {
      setSelectedSeats((prev) => {
        const next = new Set(prev);
        filteredSeats.forEach((seat) => next.delete(seat.id));
        return next;
      });
    } else {
      setSelectedSeats((prev) => {
        const next = new Set(prev);
        filteredSeats.forEach((seat) => next.add(seat.id));
        return next;
      });
    }
  };

  return (
    <div className="flex h-full shrink-0 p-2.5">
      <div className="flex h-full w-[380px] flex-col gap-3 rounded-[20px] bg-white p-2.5 shadow-card">
        <ManageEventHeader />

        <div className="flex min-h-0 flex-1 flex-col">
          <SeatSearchBar value={searchQuery} onChange={setSearchQuery} />

          <SelectAllHeader
            isAllSelected={isAllSelected}
            onToggleAll={toggleAllSeats}
          />

          <div className="flex flex-1 flex-col gap-2 overflow-y-auto pr-1">
            {filteredSeats.map((seat) => (
              <SeatItem
                key={seat.id}
                seat={seat}
                isSelected={selectedSeats.has(seat.id)}
                onToggle={() => toggleSeat(seat.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
