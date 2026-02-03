"use client";

import { X } from "lucide-react";
import { motion } from "framer-motion";

interface ReleaseHoldModalProps {
  isOpen: boolean;
  seatCount: number;
  onClose: () => void;
  onConfirm: () => void;
}

const springTransition = {
  type: "spring" as const,
  stiffness: 400,
  damping: 30,
};

export function ReleaseHoldModal({
  isOpen,
  seatCount,
  onClose,
  onConfirm,
}: ReleaseHoldModalProps) {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || seatCount === 0) return null;

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
          className="bg-white rounded-[24px] shadow-lg w-full max-w-[400px] mx-4 pointer-events-auto overflow-clip"
        >
          {/* Header */}
          <div className="flex items-end gap-[30px] pb-2 pt-8 px-6 relative">
            <h2 className="font-outfit font-black text-[20px] text-black leading-normal">
              Release {seatCount} seat{seatCount !== 1 ? "s" : ""}?
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
          <div className="px-6 py-6">
            <p className="text-sm text-black leading-normal">
              The selected seats will be removed from their holds and returned
              to on-sale.
            </p>
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
                Release
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
