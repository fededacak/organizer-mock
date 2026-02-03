"use client";

import { X, Ticket, ShoppingCart, Armchair } from "lucide-react";
import type { Seat, Section } from "../seat-settings/types";

interface SelectedSeatInfo {
  seat: Seat;
  section: Section;
}

interface SelectionSidebarProps {
  selectedSeats: SelectedSeatInfo[];
  onRemoveSeat: (seatId: string) => void;
  onClose: () => void;
}

export function SelectionSidebar({
  selectedSeats,
  onRemoveSeat,
  onClose,
}: SelectionSidebarProps) {
  const totalPrice = selectedSeats.reduce(
    (sum, { seat }) => sum + seat.price,
    0
  );

  // Group seats by section for display
  const seatsBySection = selectedSeats.reduce((acc, { seat, section }) => {
    const key = section.id;
    if (!acc[key]) {
      acc[key] = { section, seats: [] };
    }
    acc[key].seats.push(seat);
    return acc;
  }, {} as Record<string, { section: Section; seats: Seat[] }>);

  return (
    <div className="w-[300px] h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-lg text-black">Your Seats</h2>
          {selectedSeats.length > 0 && (
            <span className="bg-tp-blue text-white text-xs font-bold size-6 shrink-0 rounded-full flex items-center justify-center">
              {selectedSeats.length}
            </span>
          )}
        </div>
      </div>

      {/* Seats List */}
      <div className="flex-1 overflow-y-auto p-4">
        {selectedSeats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="size-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Armchair className="size-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">No seats selected</p>
            <p className="text-accent text-xs mt-1">
              Click on available seats to add them
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.values(seatsBySection).map(({ section, seats }) => (
              <div key={section.id}>
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="size-3 rounded-full"
                    style={{ backgroundColor: section.color }}
                  />
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {section.name}
                  </span>
                </div>
                <div className="space-y-2">
                  {seats
                    .sort((a, b) => {
                      if (a.row !== b.row) return a.row.localeCompare(b.row);
                      return parseInt(a.number) - parseInt(b.number);
                    })
                    .map((seat) => (
                      <div
                        key={seat.id}
                        className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 group"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-black">
                            Row {seat.row}, Seat {seat.number}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-black">
                            ${seat.price}
                          </span>
                          <button
                            type="button"
                            onClick={() => onRemoveSeat(seat.id)}
                            className="size-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-gray-200 transition-all duration-200"
                          >
                            <X className="size-3.5 text-gray-500" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer with Total and Checkout */}
      {selectedSeats.length > 0 && (
        <div className="p-4 border-t border-gray-200 space-y-4">
          {/* Total */}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Total</span>
            <span className="text-xl font-black text-black">
              ${totalPrice.toFixed(2)}
            </span>
          </div>

          {/* Checkout Button */}
          <button
            type="button"
            className="w-full py-3 px-4 bg-tp-blue text-white font-bold rounded-full flex items-center justify-center gap-2 hover:bg-tp-blue/90 transition-colors duration-200 cursor-pointer active:scale-[0.98] transform"
          >
            <span>Checkout</span>
          </button>
        </div>
      )}
    </div>
  );
}
