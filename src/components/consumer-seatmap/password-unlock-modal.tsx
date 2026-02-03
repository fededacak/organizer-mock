"use client";

import { useState, useEffect } from "react";
import { X, Lock, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import type { Hold } from "../seat-settings/types";

interface PasswordUnlockModalProps {
  isOpen: boolean;
  hold: Hold | null;
  onClose: () => void;
  onUnlock: (holdId: string) => void;
}

const springTransition = {
  type: "spring" as const,
  stiffness: 400,
  damping: 30,
};

export function PasswordUnlockModal({
  isOpen,
  hold,
  onClose,
  onUnlock,
}: PasswordUnlockModalProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setPassword("");
      setError(false);
    }
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!hold) return;

    // Check password
    if (password === hold.password) {
      onUnlock(hold.id);
      onClose();
    } else {
      setError(true);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) setError(false);
  };

  if (!isOpen || !hold) return null;

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[60] bg-black/50"
        onClick={handleOverlayClick}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            x: isShaking ? [0, -10, 10, -10, 10, 0] : 0,
          }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={isShaking ? { duration: 0.4 } : springTransition}
          className="bg-white rounded-[24px] shadow-lg w-full max-w-[400px] mx-4 pointer-events-auto overflow-clip"
        >
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="flex items-center gap-3 pb-2 pt-8 px-6 relative">
              <div className="size-10 bg-amber-100 rounded-full flex items-center justify-center">
                <Lock className="size-5 text-amber-600" />
              </div>
              <div>
                <h2 className="font-outfit font-black text-[20px] text-black leading-tight">
                  Unlock Seats
                </h2>
                <p className="text-sm text-gray-500">{hold.name}</p>
              </div>
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
              <p className="text-sm text-gray-600 mb-4">
                Enter the access code to unlock {hold.seatIds.length} seat
                {hold.seatIds.length !== 1 ? "s" : ""} in this section.
              </p>

              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Enter access code"
                  autoFocus
                  className={`w-full px-4 py-3 text-base border-2 rounded-xl outline-none transition-colors duration-200 ${
                    error
                      ? "border-red-400 focus:border-red-500"
                      : "border-gray-200 focus:border-tp-blue"
                  }`}
                />
                {error && (
                  <div className="flex items-center gap-1.5 mt-2 text-red-500">
                    <AlertCircle className="size-4" />
                    <span className="text-sm">Incorrect password</span>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 pt-2 pb-6">
              <div className="flex gap-4 items-center justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-[11px] text-base font-bold text-black bg-light-gray hover:bg-soft-gray rounded-[36px] transition-colors duration-200 ease cursor-pointer active:scale-[0.98] transform"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!password}
                  className="px-5 py-[11px] text-base font-bold text-white bg-tp-blue hover:bg-tp-blue/90 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-[36px] transition-colors duration-200 ease cursor-pointer active:scale-[0.98] transform"
                >
                  Unlock
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
}
