"use client";

import { useState, useEffect } from "react";
import { X, Info } from "lucide-react";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Section, Seat } from "./types";

interface SeatEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newPrice: number) => void;
  selectedSeatsBySection: Map<Section, Seat[]>;
  sections: Section[];
}

const springTransition = {
  type: "spring" as const,
  stiffness: 400,
  damping: 30,
};

export function SeatEditModal({
  isOpen,
  onClose,
  onConfirm,
  selectedSeatsBySection,
  sections,
}: SeatEditModalProps) {
  const [price, setPrice] = useState("");

  const entries = Array.from(selectedSeatsBySection.entries());
  const totalSeats = entries.reduce((acc, [, seats]) => acc + seats.length, 0);

  // Reset fields when modal opens
  useEffect(() => {
    if (isOpen) {
      setPrice("");
    }
  }, [isOpen]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    const parts = value.split(".");
    if (parts.length > 2) return;
    if (parts[1] && parts[1].length > 2) return;
    setPrice(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericPrice = parseFloat(price);
    if (!isNaN(numericPrice) && numericPrice >= 0) {
      onConfirm(numericPrice);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

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
          className="bg-white rounded-[24px] shadow-lg w-full max-w-[420px] mx-2 pointer-events-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-center pb-2 pt-8 px-5 relative">
            <h2 className="font-outfit font-extrabold text-[20px] text-black">
              Edit Seat Price
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 w-6 h-6 bg-light-gray rounded-full flex items-center justify-center hover:bg-soft-gray transition-colors duration-200 ease cursor-pointer"
            >
              <X className="w-4 h-4 text-gray" />
            </button>
          </div>

          {/* Content */}
          <div className="px-4 md:px-6 py-4 flex flex-col gap-4">
            {/* Selected seats summary */}
            <div className="rounded-[14px] bg-light-gray p-4">
              <p className="text-sm text-black font-bold mb-2">
                Setting price override for {totalSeats} seat{totalSeats !== 1 ? "s" : ""}:
              </p>
              <div className="flex flex-wrap gap-2">
                {entries.map(([section, seats]) => (
                  <span
                    key={section.id}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5"
                  >
                    <div
                      className="size-2 rounded-full"
                      style={{ backgroundColor: section.color }}
                    />
                    <span className="text-sm font-medium text-black">
                      {section.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({seats.length})
                    </span>
                  </span>
                ))}
              </div>
            </div>

            {/* Price Section */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <label className="font-bold text-sm text-black">
                    Price per seat ($)
                  </label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" className="cursor-default">
                        <Info className="w-3.5 h-3.5 text-gray" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p className="max-w-[200px]">
                        This price overrides the section price for these specific seats.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <input
                  type="text"
                  inputMode="decimal"
                  value={price ? `$${price}` : ""}
                  onChange={(e) => {
                    const val = e.target.value.replace("$", "");
                    handlePriceChange({
                      target: { value: val },
                    } as React.ChangeEvent<HTMLInputElement>);
                  }}
                  placeholder="$0.00"
                  className="w-full h-[47px] px-4 text-sm text-black placeholder:text-gray bg-light-gray rounded-[14px] focus:outline-none focus:ring-1 focus:ring-tp-blue transition-all duration-200 ease"
                  autoFocus
                />
              </div>

              <p className="text-xs text-gray">
                These seats will keep this custom price even if section prices change.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pb-6 pt-2 px-4 md:px-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-base font-bold text-dark-gray hover:text-black bg-light-gray hover:bg-soft-gray rounded-[36px] transition-colors duration-200 ease cursor-pointer active:scale-[0.98] transform"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!price || parseFloat(price) < 0}
              className="bg-tp-blue cursor-pointer text-white font-bold text-base px-5 py-2.5 rounded-[36px] hover:bg-[#2288ee] transition-colors duration-200 ease active:scale-[0.98] transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
