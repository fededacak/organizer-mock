"use client";

import { X } from "lucide-react";
import { motion } from "framer-motion";
import type { Hold } from "./types";

export interface MoveHoldInfo {
  fromHold: Hold;
  seatCount: number;
}

interface MoveHoldModalProps {
  isOpen: boolean;
  targetHold: Hold | null;
  moveInfo: MoveHoldInfo[];
  onSaleSeatsCount: number;
  onClose: () => void;
  onConfirm: () => void;
}

const springTransition = {
  type: "spring" as const,
  stiffness: 400,
  damping: 30,
};

export function MoveHoldModal({
  isOpen,
  targetHold,
  moveInfo,
  onSaleSeatsCount,
  onClose,
  onConfirm,
}: MoveHoldModalProps) {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const totalSeatsToMove = moveInfo.reduce(
    (sum, info) => sum + info.seatCount,
    0
  );
  const totalSeats = totalSeatsToMove + onSaleSeatsCount;

  if (!isOpen || !targetHold || totalSeats === 0) return null;

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-black/50"
        onClick={handleOverlayClick}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={springTransition}
          className="bg-white rounded-[24px] shadow-lg w-full max-w-[440px] mx-4 pointer-events-auto overflow-clip"
        >
          {/* Header */}
          <div className="flex items-end gap-[30px] pb-2 pt-8 px-6 relative">
            <h2 className="font-outfit font-black text-[20px] text-black leading-normal">
              Move {totalSeats} seat{totalSeats !== 1 ? "s" : ""} to{" "}
              {targetHold.name}?
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 size-6 bg-light-gray rounded-full flex items-center justify-center hover:bg-soft-gray transition-colors duration-200 ease cursor-pointer"
            >
              <X className="size-4 text-gray" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6 space-y-4">
            {/* Moving from other holds */}
            {moveInfo.length > 0 && (
              <div className="flex flex-col gap-1.5 w-full">
                <p className="text-sm text-foregound font-semibold">
                  Moving {totalSeats} seat{totalSeats !== 1 ? "s" : ""} from:
                </p>
                <div className="space-y-2">
                  {moveInfo.map(({ fromHold, seatCount }) => (
                    <div
                      key={fromHold.id}
                      className="flex items-center gap-3 bg-light-gray rounded-xl px-4 py-3"
                    >
                      <div
                        className="size-3 rounded-full shrink-0"
                        style={{ backgroundColor: fromHold.color }}
                      />
                      <span className="text-sm text-black font-medium flex-1">
                        {fromHold.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Adding from on-sale */}
            {onSaleSeatsCount > 0 && (
              <div className="flex flex-col gap-1.5 w-full">
                <p className="text-sm text-foreground font-semibold">
                  Adding {onSaleSeatsCount} seat
                  {onSaleSeatsCount !== 1 ? "s" : ""} from:
                </p>
                <div className="flex items-center gap-3 bg-light-gray rounded-xl px-4 py-3">
                  <div className="size-3 rounded-full shrink-0 bg-emerald-500" />
                  <span className="text-sm text-black font-medium flex-1">
                    On Sale
                  </span>
                </div>
              </div>
            )}

            {/* Target hold */}
            <div className="flex flex-col gap-1.5 w-full">
              <p className="text-sm text-foreground font-semibold">To:</p>
              <div className="flex items-center gap-3 bg-light-gray rounded-xl px-4 py-3">
                <div
                  className="size-3 rounded-full shrink-0"
                  style={{ backgroundColor: targetHold.color }}
                />
                <span className="text-sm text-black font-medium flex-1">
                  {targetHold.name}
                </span>
                <span className="text-sm text-gray">
                  {targetHold.seatIds.length} seat
                  {targetHold.seatIds.length !== 1 ? "s" : ""} currently
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pt-2 pb-6">
            <div className="flex gap-3 items-center justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-[11px] text-base font-bold text-black bg-light-gray hover:bg-soft-gray rounded-full transition-colors duration-200 ease cursor-pointer active:scale-[0.98] transform"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="px-5 py-[11px] text-base font-bold text-white bg-primary rounded-full transition-opacity duration-200 ease cursor-pointer active:scale-[0.98] transform hover:opacity-80"
              >
                Move Seats
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
