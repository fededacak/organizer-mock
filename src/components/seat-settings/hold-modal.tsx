"use client";

import { useState, useEffect, useMemo } from "react";
import { X, Lock, Eye, Calendar as CalendarIcon } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import type { Section, Seat, Hold, HoldType } from "./types";
import { HOLD_COLORS } from "./types";

interface HoldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (hold: Omit<Hold, "id" | "createdAt">) => void;
  selectedSeatsBySection: Map<Section, Seat[]>;
  existingHold?: Hold; // For editing existing holds
}

const springTransition = {
  type: "spring" as const,
  stiffness: 400,
  damping: 30,
};

export function HoldModal({
  isOpen,
  onClose,
  onConfirm,
  selectedSeatsBySection,
  existingHold,
}: HoldModalProps) {
  // Form state
  const [name, setName] = useState("");
  const [holdType, setHoldType] = useState<HoldType>("internal");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [enableDateRange, setEnableDateRange] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState<string>(
    HOLD_COLORS[0].value
  );

  // Popover states
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  const isEditing = !!existingHold;

  const entries = Array.from(selectedSeatsBySection.entries());
  const totalSeats = entries.reduce((acc, [, seats]) => acc + seats.length, 0);

  // Get all seat IDs
  const seatIds = useMemo(() => {
    const ids: string[] = [];
    entries.forEach(([, seats]) => {
      seats.forEach((seat) => ids.push(seat.id));
    });
    return ids;
  }, [entries]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (existingHold) {
        setName(existingHold.name);
        setHoldType(existingHold.type);
        setPassword(existingHold.password || "");
        setEnableDateRange(!!(existingHold.startDate || existingHold.endDate));
        setStartDate(existingHold.startDate);
        setEndDate(existingHold.endDate);
        setSelectedColor(existingHold.color);
      } else {
        setName("");
        setHoldType("internal");
        setPassword("");
        setShowPassword(false);
        setEnableDateRange(false);
        setStartDate(undefined);
        setEndDate(undefined);
        setSelectedColor(HOLD_COLORS[0].value);
      }
    }
  }, [isOpen, existingHold]);

  // Generate a random password
  const generatePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(result);
    setShowPassword(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    const hold: Omit<Hold, "id" | "createdAt"> = {
      name: name.trim(),
      type: holdType,
      password: holdType === "password-protected" ? password : undefined,
      startDate: enableDateRange ? startDate : undefined,
      endDate: enableDateRange ? endDate : undefined,
      color: selectedColor,
      seatIds,
    };

    onConfirm(hold);
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
          className="bg-white rounded-[24px] shadow-lg w-full max-w-[420px] mx-2 pointer-events-auto max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-center pb-2 pt-8 px-5 relative">
            <h2 className="font-outfit font-extrabold text-[20px] text-black">
              {isEditing ? "Edit Hold" : "Create Hold"}
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
          <form
            onSubmit={handleSubmit}
            className="px-4 md:px-6 py-4 flex flex-col gap-5"
          >
            {/* Selected seats summary */}
            <div className="rounded-[14px] bg-light-gray p-4 flex gap-2 items-center flex-wrap">
              <p className="text-sm text-black font-bold">Hold:</p>
              <div className="flex flex-wrap gap-2">
                {entries.map(([section, seats]) => (
                  <span
                    key={section.id}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5"
                  >
                    <span className="text-sm font-semibold text-black">
                      {section.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({seats.length})
                    </span>
                  </span>
                ))}
              </div>
            </div>

            {/* Hold Name */}
            <div className="flex flex-col gap-1">
              <label className="font-bold text-sm text-black">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VIP Guest List, Sponsor Block"
                className="w-full h-[47px] px-4 text-sm text-black placeholder:text-gray bg-white border border-neutral-200 rounded-[14px] focus:outline-none focus:border-tp-blue transition-colors duration-200 ease"
                autoFocus
              />
            </div>

            {/* Color Selection */}
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm text-black">
                Label color
              </label>
              <div className="flex items-center gap-2">
                {HOLD_COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setSelectedColor(color.value)}
                    className={cn(
                      "size-8 rounded-full transition-all duration-200 ease cursor-pointer",
                      selectedColor === color.value
                        ? "ring-2 ring-offset-2 ring-black"
                        : "hover:scale-110"
                    )}
                    style={{ backgroundColor: color.value }}
                  />
                ))}
              </div>
            </div>

            {/* Password Protection Checkbox */}
            <div className="flex w-full flex-col gap-2">
              <button
                type="button"
                onClick={() =>
                  setHoldType(
                    holdType === "password-protected"
                      ? "internal"
                      : "password-protected"
                  )
                }
                className="flex items-center gap-2 cursor-pointer self-start"
              >
                <div
                  className={cn(
                    "w-4 h-4 rounded-[5px] border-[1.5px] flex items-center justify-center transition-colors duration-200 ease",
                    holdType === "password-protected"
                      ? "bg-tp-blue border-tp-blue"
                      : "border-dark-gray"
                  )}
                >
                  {holdType === "password-protected" && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path
                        d="M1 4L3.5 6.5L9 1"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-sm font-semibold text-black">
                  Unlock with password
                </span>
              </button>

              {/* Password Field (only for password-protected) */}
              {holdType === "password-protected" && (
                <div className="flex flex-col gap-1.5 bg-light-gray rounded-[14px] p-4">
                  <label className="font-bold text-sm text-black">
                    Access code
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value.toUpperCase())
                      }
                      placeholder="Enter access code"
                      className="w-full h-[47px] px-4 pr-12 text-sm text-black placeholder:text-gray bg-white rounded-[12px] focus:outline-none focus:ring-1 focus:ring-tp-blue transition-all duration-200 ease"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Availability Window */}
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setEnableDateRange(!enableDateRange)}
                className="flex items-center gap-2 cursor-pointer self-start"
              >
                <div
                  className={cn(
                    "w-4 h-4 rounded-[5px] border-[1.5px] flex items-center justify-center transition-colors duration-200 ease",
                    enableDateRange
                      ? "bg-tp-blue border-tp-blue"
                      : "border-dark-gray"
                  )}
                >
                  {enableDateRange && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path
                        d="M1 4L3.5 6.5L9 1"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-sm font-semibold text-black">
                  Holding window
                </span>
              </button>

              {enableDateRange && (
                <div className="bg-light-gray rounded-[14px] p-4 flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    {/* Start Date */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-black">
                        Start date
                      </label>
                      <Popover
                        open={startDateOpen}
                        onOpenChange={setStartDateOpen}
                      >
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            className="h-[42px] px-3 bg-white rounded-[12px] flex items-center gap-2 text-sm text-left cursor-pointer hover:bg-soft-gray transition-colors duration-200 ease"
                          >
                            <span
                              className={startDate ? "text-black" : "text-gray"}
                            >
                              {startDate
                                ? format(startDate, "MMM d, yyyy")
                                : "Select"}
                            </span>
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={(date) => {
                              setStartDate(date);
                              setStartDateOpen(false);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* End Date */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-black">
                        End date
                      </label>
                      <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            className="h-[42px] px-3 bg-white rounded-[12px] flex items-center gap-2 text-sm text-left cursor-pointer transition-colors duration-200 ease"
                          >
                            <span
                              className={endDate ? "text-black" : "text-gray"}
                            >
                              {endDate
                                ? format(endDate, "MMM d, yyyy")
                                : "Select"}
                            </span>
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={(date) => {
                              setEndDate(date);
                              setEndDateOpen(false);
                            }}
                            disabled={(date) =>
                              startDate ? date < startDate : false
                            }
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-base font-bold text-black bg-light-gray hover:bg-soft-gray rounded-[36px] transition-colors duration-200 ease cursor-pointer active:scale-[0.98] transform"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!name.trim()}
                className="bg-primary cursor-pointer text-white font-bold text-base px-5 py-2.5 rounded-[36px] hover:opacity-80 transition-opacity duration-200 ease active:scale-[0.98] transform disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                {isEditing ? "Save" : "Create Hold"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
}
