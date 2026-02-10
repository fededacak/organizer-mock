"use client";

import { useState, useMemo } from "react";
import { X, Armchair } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Seat, Section, Hold } from "../seat-settings/types";
import { getConsumerSeatState } from "./consumer-seat-button";
import { SelectedSeatRow } from "./selected-seat-row";
import { SectionLabel } from "./section-label";
import { SidebarTabs, type TabType } from "./sidebar-tabs";
import { SectionAccordionButton } from "./section-accordion-button";
import { BrowseSeatRow } from "./browse-seat-row";

interface SelectedSeatInfo {
  seat: Seat;
  section: Section;
}

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
  const [activeTab, setActiveTab] = useState<TabType>("your-seats");

  // Single-open accordion state
  const [expandedSectionId, setExpandedSectionId] = useState<string | null>(
    null,
  );

  const totalPrice = selectedSeats.reduce(
    (sum, { seat }) => sum + seat.price,
    0,
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
  const seatsBySection = selectedSeats.reduce(
    (acc, { seat, section }) => {
      const key = section.id;
      if (!acc[key]) {
        acc[key] = { section, seats: [] };
      }
      acc[key].seats.push(seat);
      return acc;
    },
    {} as Record<string, { section: Section; seats: Seat[] }>,
  );

  // Get selected seat IDs as a Set for quick lookup
  const selectedSeatIds = useMemo(() => {
    return new Set(selectedSeats.map(({ seat }) => seat.id));
  }, [selectedSeats]);

  // Process sections for browse view
  const browseSections = useMemo(() => {
    return sections
      .map((section) => {
        // Get available and locked seats
        const availableSeats = section.seats.filter((seat) => {
          const hold = getHoldForSeat(seat);
          const state = getConsumerSeatState(
            seat,
            hold,
            unlockedHolds.has(hold?.id || ""),
          );
          return state === "available" || state === "locked";
        });

        // Sort by price (lowest first)
        const sortedSeats = [...availableSeats].sort(
          (a, b) => a.price - b.price,
        );

        // Get price for section header (use first available seat's price, or lowest)
        const lowestPrice =
          sortedSeats.length > 0 ? sortedSeats[0].price : null;

        return {
          section,
          availableSeats: sortedSeats,
          lowestPrice,
          isSoldOut: sortedSeats.length === 0,
        };
      })
      .sort((a, b) => {
        // Sold out sections go to the end
        if (a.isSoldOut && !b.isSoldOut) return 1;
        if (!a.isSoldOut && b.isSoldOut) return -1;
        if (a.isSoldOut && b.isSoldOut) return 0;
        // Sort by lowest price, ascending
        return (a.lowestPrice ?? Infinity) - (b.lowestPrice ?? Infinity);
      });
  }, [sections, unlockedHolds, holdMap]);

  // Toggle section accordion
  const toggleSection = (sectionId: string) => {
    setExpandedSectionId((prev) => (prev === sectionId ? null : sectionId));
  };

  return (
    <div className="md:w-[300px] md:absolute md:right-2 md:bottom-2 md:top-2 max-h-[75dvh] md:max-h-none bg-white rounded-2xl flex flex-col z-30 overflow-hidden shadow-floating shrink-0">
      {/* Header */}
      <div className="p-4 pt-5 md:pt-4 ">
        <div className="flex items-center gap-2">
          <h2 className="font-bold md:text-lg text-xl text-black">
            Select seats
          </h2>
          {selectedSeats.length > 0 && (
            <span className="bg-tp-blue text-white md:text-xs text-sm font-bold md:size-5 size-6 shrink-0 rounded-full flex items-center justify-center">
              {selectedSeats.length}
            </span>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <SidebarTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "your-seats" ? (
          // Your Seats Tab Content
          <div className="p-3 md:px-3 px-4">
            {selectedSeats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center md:py-10 py-8 rounded-[14px] bg-light-gray mb-3">
                <p className="text-foreground md:text-sm text-base">
                  No seats selected
                </p>
                <p className="text-muted-foreground md:text-xs text-sm mt-0.5">
                  Click on available seats to add them
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <AnimatePresence initial={false}>
                  {Object.values(seatsBySection).map(({ section, seats }) => (
                    <motion.div
                      key={section.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{
                        height: { type: "spring", bounce: 0, duration: 0.3 },
                        opacity: { duration: 0.2 },
                      }}
                    >
                      <SectionLabel
                        name={section.name}
                        color={section.color ?? "#9ca3af"}
                      />
                      <div className="flex flex-col gap-2">
                        <AnimatePresence initial={false}>
                          {seats
                            .sort((a, b) => {
                              if (a.row !== b.row)
                                return a.row.localeCompare(b.row);
                              return parseInt(a.number) - parseInt(b.number);
                            })
                            .map((seat) => (
                              <motion.div
                                key={seat.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{
                                  type: "spring",
                                  bounce: 0,
                                  duration: 0.25,
                                }}
                              >
                                <SelectedSeatRow
                                  color={section.color ?? "#9ca3af"}
                                  seat={seat}
                                  onRemove={onRemoveSeat}
                                />
                              </motion.div>
                            ))}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        ) : (
          // Browse Tab Content
          <div>
            {browseSections.map(
              ({ section, availableSeats, lowestPrice, isSoldOut }) => (
                <div
                  key={section.id}
                  className="border-b border-gray-100 last:border-b-0"
                >
                  {/* Section Header */}
                  <SectionAccordionButton
                    name={section.name}
                    color={section.color ?? "#9ca3af"}
                    lowestPrice={lowestPrice}
                    isSoldOut={isSoldOut}
                    isExpanded={expandedSectionId === section.id}
                    onToggle={() => toggleSection(section.id)}
                    selectedCount={
                      section.seats.filter((s) => selectedSeatIds.has(s.id))
                        .length
                    }
                  />

                  {/* Section Content (Expanded) */}
                  {expandedSectionId === section.id && !isSoldOut && (
                    <div className="md:px-3 px-4 py-2 flex flex-col gap-2">
                      {availableSeats.map((seat) => {
                        const hold = getHoldForSeat(seat);
                        const isUnlocked = unlockedHolds.has(hold?.id || "");
                        const state = getConsumerSeatState(
                          seat,
                          hold,
                          isUnlocked,
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
                          <BrowseSeatRow
                            key={seat.id}
                            seat={seat}
                            isSelected={isSelected}
                            isLocked={isLocked}
                            color={section.color ?? "#9ca3af"}
                            onAction={handleSeatAction}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              ),
            )}
          </div>
        )}
      </div>

      {/* Footer with Total and Checkout */}
      {selectedSeats.length > 0 && (
        <div className="md:p-3 p-4 pt-2.5 flex flex-col gap-2">
          {/* Total */}
          <div className="flex items-center justify-between px-2">
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
