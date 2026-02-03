"use client";

import { useState, useCallback, useMemo } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { Section, Seat, Hold } from "../seat-settings/types";
import { ConsumerSeatmapDisplay } from "./consumer-seatmap-display";
import { SelectionSidebar } from "./selection-sidebar";
import { PasswordUnlockModal } from "./password-unlock-modal";
import { consumerSections, consumerHolds } from "./consumer-mock-data";

interface ConsumerSeatmapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const springTransition = {
  type: "spring" as const,
  stiffness: 400,
  damping: 30,
};

export function ConsumerSeatmapModal({
  isOpen,
  onClose,
}: ConsumerSeatmapModalProps) {
  // Selected seat IDs
  const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());

  // Unlocked hold IDs (holds whose password was correctly entered)
  const [unlockedHolds, setUnlockedHolds] = useState<Set<string>>(new Set());

  // Password modal state
  const [passwordModalHold, setPasswordModalHold] = useState<Hold | null>(null);

  // Create hold map for quick lookup
  const holdMap = useMemo(() => {
    const map = new Map<string, Hold>();
    for (const hold of consumerHolds) {
      map.set(hold.id, hold);
    }
    return map;
  }, []);

  // Get section for a seat
  const getSectionForSeat = useCallback(
    (seatId: string): Section | undefined => {
      for (const section of consumerSections) {
        if (section.seats.find((s) => s.id === seatId)) {
          return section;
        }
      }
      return undefined;
    },
    []
  );

  // Get seat object by ID
  const getSeat = useCallback((seatId: string): Seat | undefined => {
    for (const section of consumerSections) {
      const seat = section.seats.find((s) => s.id === seatId);
      if (seat) return seat;
    }
    return undefined;
  }, []);

  // Toggle seat selection
  const handleSelectSeat = useCallback((seatId: string) => {
    setSelectedSeats((prev) => {
      const next = new Set(prev);
      if (next.has(seatId)) {
        next.delete(seatId);
      } else {
        next.add(seatId);
      }
      return next;
    });
  }, []);

  // Remove seat from selection
  const handleRemoveSeat = useCallback((seatId: string) => {
    setSelectedSeats((prev) => {
      const next = new Set(prev);
      next.delete(seatId);
      return next;
    });
  }, []);

  // Handle locked seat click - open password modal
  const handleLockedClick = useCallback((hold: Hold) => {
    setPasswordModalHold(hold);
  }, []);

  // Handle successful password unlock
  const handleUnlock = useCallback((holdId: string) => {
    setUnlockedHolds((prev) => new Set(prev).add(holdId));
    setPasswordModalHold(null);
  }, []);

  // Get selected seat info for sidebar
  const selectedSeatInfo = useMemo(() => {
    const info: { seat: Seat; section: Section }[] = [];
    for (const seatId of selectedSeats) {
      const seat = getSeat(seatId);
      const section = getSectionForSeat(seatId);
      if (seat && section) {
        info.push({ seat, section });
      }
    }
    return info;
  }, [selectedSeats, getSeat, getSectionForSeat]);

  // Handle close - reset state
  const handleClose = useCallback(() => {
    setSelectedSeats(new Set());
    setUnlockedHolds(new Set());
    setPasswordModalHold(null);
    onClose();
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <TooltipProvider delayDuration={100}>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60"
            onClick={handleClose}
          />

          {/* Modal Container - Nearly fullscreen */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={springTransition}
            className="fixed inset-4 z-50 bg-white rounded-[24px] shadow-2xl overflow-hidden flex"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-4 top-4 z-40 size-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white shadow-md transition-colors duration-200 ease cursor-pointer"
            >
              <X className="size-5 text-gray-700" />
            </button>
            {/* Selection Sidebar */}
            <SelectionSidebar
              selectedSeats={selectedSeatInfo}
              onRemoveSeat={handleRemoveSeat}
              onClose={handleClose}
            />

            {/* Seatmap Area */}
            <div className="flex-1 relative bg-red-200">
              <ConsumerSeatmapDisplay
                sections={consumerSections}
                holds={consumerHolds}
                selectedSeats={selectedSeats}
                unlockedHolds={unlockedHolds}
                onSelectSeat={handleSelectSeat}
                onLockedClick={handleLockedClick}
              />
            </div>

            {/* Password Modal (nested) */}
            <PasswordUnlockModal
              isOpen={passwordModalHold !== null}
              hold={passwordModalHold}
              onClose={() => setPasswordModalHold(null)}
              onUnlock={handleUnlock}
            />
          </motion.div>
        </TooltipProvider>
      )}
    </AnimatePresence>
  );
}
