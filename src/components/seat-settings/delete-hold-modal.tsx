"use client";

import { X, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import type { Hold } from "./types";

interface DeleteHoldModalProps {
  isOpen: boolean;
  hold: Hold | null;
  onClose: () => void;
  onConfirm: () => void;
}

const springTransition = {
  type: "spring" as const,
  stiffness: 400,
  damping: 30,
};

export function DeleteHoldModal({
  isOpen,
  hold,
  onClose,
  onConfirm,
}: DeleteHoldModalProps) {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !hold) return null;

  const seatCount = hold.seatIds.length;

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
          className="bg-white rounded-[24px] shadow-lg w-full max-w-[400px] mx-4 pointer-events-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-center pb-2 pt-8 px-5 relative">
            <div className="flex size-12 items-center justify-center rounded-full bg-red-100 mb-2">
              <AlertTriangle className="size-6 text-red-500" />
            </div>
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 w-6 h-6 bg-light-gray rounded-full flex items-center justify-center hover:bg-soft-gray transition-colors duration-200 ease cursor-pointer"
            >
              <X className="w-4 h-4 text-gray" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 pb-6 flex flex-col items-center text-center">
            <h2 className="font-outfit font-extrabold text-[20px] text-black mb-2">
              Remove Hold
            </h2>
            <p className="text-sm text-gray mb-6">
              Are you sure you want to remove{" "}
              <span className="font-semibold text-black">"{hold.name}"</span>?
              <br />
              This will release {seatCount} seat{seatCount !== 1 ? "s" : ""}{" "}
              back to on-sale.
            </p>

            {/* Actions */}
            <div className="flex gap-3 w-full">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-5 py-2.5 text-base font-bold text-dark-gray hover:text-black bg-light-gray hover:bg-soft-gray rounded-[36px] transition-colors duration-200 ease cursor-pointer active:scale-[0.98] transform"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="flex-1 px-5 py-2.5 text-base font-bold text-white bg-red-500 hover:bg-red-600 rounded-[36px] transition-colors duration-200 ease cursor-pointer active:scale-[0.98] transform"
              >
                Remove Hold
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
