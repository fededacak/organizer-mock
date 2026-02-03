"use client";

import { useState, useEffect, useMemo } from "react";
import { X, Armchair, ChevronDown, Plus, Check, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Seat, Section, Hold } from "../seat-settings/types";
import { getConsumerSeatState } from "./consumer-seat-button";

interface SelectedSeatInfo {
  seat: Seat;
  section: Section;
}

type TabType = "your-seats" | "browse";

interface SelectionSidebarProps {
  selectedSeats: SelectedSeatInfo[];
  onRemoveSeat: (seatId: string) => void;
  onClose: () => void;
  // New props for browse functionality
  sections: Section[];
  holds: Hold[];
  unlockedHolds: Set<string>;
  onSelectSeat: (seatId: string) => void;
  onLockedClick: (hold: Hold) => void;
}

export function SelectionSidebar({
  selectedSeats,
  onRemoveSeat,
  onClose,
  sections,
  holds,
  unlockedHolds,
  onSelectSeat,
  onLockedClick,
}: SelectionSidebarProps) {
  // Tab state - will be set by useEffect on mount based on screen size
  const [activeTab, setActiveTab] = useState<TabType>("your-seats");

  // Single-open accordion state
  const [expandedSectionId, setExpandedSectionId] = useState<string | null>(
    null
  );

  // Set default tab based on screen size on mount
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    if (mediaQuery.matches) {
      setActiveTab("browse");
    }
  }, []);

  const totalPrice = selectedSeats.reduce(
    (sum, { seat }) => sum + seat.price,
    0
  );

  // Create hold map for quick lookup
  const holdMap = useMemo(() => {
    const map = new Map<string, Hold>();
    for (const hold of holds) {
      map.set(hold.id, hold);
    }
    return map;
  }, [holds]);

  // Get hold for a seat
  const getHoldForSeat = (seat: Seat): Hold | undefined => {
    if (!seat.holdId) return undefined;
    return holdMap.get(seat.holdId);
  };

  // Group seats by section for display (selected seats tab)
  const seatsBySection = selectedSeats.reduce((acc, { seat, section }) => {
    const key = section.id;
    if (!acc[key]) {
      acc[key] = { section, seats: [] };
    }
    acc[key].seats.push(seat);
    return acc;
  }, {} as Record<string, { section: Section; seats: Seat[] }>);

  // Get selected seat IDs as a Set for quick lookup
  const selectedSeatIds = useMemo(() => {
    return new Set(selectedSeats.map(({ seat }) => seat.id));
  }, [selectedSeats]);

  // Process sections for browse view
  const browseSections = useMemo(() => {
    return sections.map((section) => {
      // Get available and locked seats
      const availableSeats = section.seats.filter((seat) => {
        const hold = getHoldForSeat(seat);
        const state = getConsumerSeatState(
          seat,
          hold,
          unlockedHolds.has(hold?.id || "")
        );
        return state === "available" || state === "locked";
      });

      // Sort by price (lowest first)
      const sortedSeats = [...availableSeats].sort((a, b) => a.price - b.price);

      // Get price for section header (use first available seat's price, or lowest)
      const lowestPrice = sortedSeats.length > 0 ? sortedSeats[0].price : null;

      return {
        section,
        availableSeats: sortedSeats,
        lowestPrice,
        isSoldOut: sortedSeats.length === 0,
      };
    });
  }, [sections, unlockedHolds, holdMap]);

  // Toggle section accordion
  const toggleSection = (sectionId: string) => {
    setExpandedSectionId((prev) => (prev === sectionId ? null : sectionId));
  };

  return (
    <div className="w-[300px] h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-lg text-black">Select Seats</h2>
          {selectedSeats.length > 0 && (
            <span className="bg-tp-blue text-white text-xs font-bold size-6 shrink-0 rounded-full flex items-center justify-center">
              {selectedSeats.length}
            </span>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        <button
          type="button"
          onClick={() => setActiveTab("your-seats")}
          className={cn(
            "flex-1 py-3 text-sm font-medium transition-colors duration-200 ease relative",
            activeTab === "your-seats"
              ? "text-tp-blue"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          Your Seats
          {activeTab === "your-seats" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-tp-blue" />
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("browse")}
          className={cn(
            "flex-1 py-3 text-sm font-medium transition-colors duration-200 ease relative",
            activeTab === "browse"
              ? "text-tp-blue"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          Browse
          {activeTab === "browse" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-tp-blue" />
          )}
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "your-seats" ? (
          // Your Seats Tab Content
          <div className="p-4">
            {selectedSeats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="size-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Armchair className="size-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-sm">
                  No seats selected
                </p>
                <p className="text-gray-400 text-xs mt-1">
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
                          if (a.row !== b.row)
                            return a.row.localeCompare(b.row);
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
        ) : (
          // Browse Tab Content
          <div className="py-2">
            {browseSections.map(
              ({ section, availableSeats, lowestPrice, isSoldOut }) => (
                <div
                  key={section.id}
                  className="border-b border-gray-100 last:border-b-0"
                >
                  {/* Section Header */}
                  <button
                    type="button"
                    onClick={() => !isSoldOut && toggleSection(section.id)}
                    disabled={isSoldOut}
                    className={cn(
                      "w-full px-4 py-3 flex items-center justify-between transition-colors duration-200 ease",
                      isSoldOut
                        ? "cursor-not-allowed opacity-50"
                        : "hover:bg-gray-50 cursor-pointer"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <ChevronDown
                        className={cn(
                          "size-4 text-gray-400 transition-transform duration-200",
                          expandedSectionId === section.id && "rotate-180"
                        )}
                      />
                      <span
                        className={cn(
                          "text-sm font-medium",
                          isSoldOut ? "text-gray-400" : "text-black"
                        )}
                      >
                        {section.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isSoldOut ? (
                        <span className="text-xs text-gray-400 font-medium">
                          Sold Out
                        </span>
                      ) : (
                        <span className="text-sm font-semibold text-black">
                          ${lowestPrice}
                        </span>
                      )}
                    </div>
                  </button>

                  {/* Section Content (Expanded) */}
                  {expandedSectionId === section.id && !isSoldOut && (
                    <div className="px-4 pb-3 space-y-1">
                      {availableSeats.map((seat) => {
                        const hold = getHoldForSeat(seat);
                        const isUnlocked = unlockedHolds.has(hold?.id || "");
                        const state = getConsumerSeatState(
                          seat,
                          hold,
                          isUnlocked
                        );
                        const isSelected = selectedSeatIds.has(seat.id);
                        const isLocked = state === "locked";

                        const handleSeatAction = () => {
                          if (isLocked && hold) {
                            onLockedClick(hold);
                          } else {
                            onSelectSeat(seat.id);
                          }
                        };

                        return (
                          <div
                            key={seat.id}
                            className={cn(
                              "flex items-center justify-between rounded-lg px-3 py-2 transition-colors duration-150 ease-out",
                              isSelected
                                ? "bg-tp-blue/10"
                                : "bg-gray-50 hover:bg-gray-100"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-black">
                                Row {seat.row}, Seat {seat.number}
                              </span>
                              {isLocked && (
                                <Lock className="size-3 text-amber-500" />
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-black">
                                ${seat.price}
                              </span>
                              <button
                                type="button"
                                onClick={handleSeatAction}
                                className={cn(
                                  "size-6 rounded-full flex items-center justify-center transition-all duration-150 ease-out cursor-pointer",
                                  isSelected
                                    ? "bg-tp-blue text-white"
                                    : isLocked
                                    ? "bg-amber-500 text-white hover:bg-amber-600"
                                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                                )}
                              >
                                {isSelected ? (
                                  <Check
                                    className="size-3.5"
                                    strokeWidth={2.5}
                                  />
                                ) : isLocked ? (
                                  <Lock className="size-3" strokeWidth={2.5} />
                                ) : (
                                  <Plus
                                    className="size-3.5"
                                    strokeWidth={2.5}
                                  />
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )
            )}
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
