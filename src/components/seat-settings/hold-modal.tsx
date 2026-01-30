"use client";

import { useState, useEffect, useMemo } from "react";
import { X, Lock, Eye, Calendar as CalendarIcon, ChevronDown, Copy, Check, Info } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import type { Section, Seat, Hold, HoldType, ReleaseAction } from "./types";
import { HOLD_COLORS } from "./types";

interface HoldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (hold: Omit<Hold, "id" | "createdAt">) => void;
  onDelete?: () => void;
  selectedSeatsBySection: Map<Section, Seat[]>;
  existingHold?: Hold; // For editing existing holds
}

const springTransition = {
  type: "spring" as const,
  stiffness: 400,
  damping: 30,
};

const RELEASE_OPTIONS = [
  { value: "auto-release", label: "Auto-release seats" },
  { value: "manual", label: "Keep on hold (manual)" },
] as const;

export function HoldModal({
  isOpen,
  onClose,
  onConfirm,
  onDelete,
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
  const [releaseAction, setReleaseAction] = useState<ReleaseAction>("auto-release");
  const [maxPurchaseLimit, setMaxPurchaseLimit] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedColor, setSelectedColor] = useState<string>(HOLD_COLORS[0].value);
  const [copiedLink, setCopiedLink] = useState(false);

  // Popover states
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [releasePopoverOpen, setReleasePopoverOpen] = useState(false);

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
        setReleaseAction(existingHold.releaseAction);
        setMaxPurchaseLimit(existingHold.maxPurchaseLimit?.toString() || "");
        setNotes(existingHold.notes || "");
        setSelectedColor(existingHold.color);
      } else {
        setName("");
        setHoldType("internal");
        setPassword("");
        setShowPassword(false);
        setEnableDateRange(false);
        setStartDate(undefined);
        setEndDate(undefined);
        setReleaseAction("auto-release");
        setMaxPurchaseLimit("");
        setNotes("");
        setSelectedColor(HOLD_COLORS[0].value);
      }
      setCopiedLink(false);
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

  // Copy shareable link
  const copyShareableLink = () => {
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/checkout?hold=${encodeURIComponent(name || "hold")}&code=${password}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const hold: Omit<Hold, "id" | "createdAt"> = {
      name: name.trim() || "Untitled Hold",
      type: holdType,
      password: holdType === "password-protected" ? password : undefined,
      startDate: enableDateRange ? startDate : undefined,
      endDate: enableDateRange ? endDate : undefined,
      maxPurchaseLimit: maxPurchaseLimit ? parseInt(maxPurchaseLimit) : undefined,
      releaseAction,
      notes: notes.trim() || undefined,
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

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setMaxPurchaseLimit(value);
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
          className="bg-white rounded-[24px] shadow-lg w-full max-w-[480px] mx-2 pointer-events-auto max-h-[90vh] overflow-y-auto"
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
          <form onSubmit={handleSubmit} className="px-4 md:px-6 py-4 flex flex-col gap-5">
            {/* Selected seats summary */}
            <div className="rounded-[14px] bg-light-gray p-4">
              <p className="text-sm text-black font-bold mb-2">
                Holding {totalSeats} seat{totalSeats !== 1 ? "s" : ""}:
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

            {/* Hold Name */}
            <div className="flex flex-col gap-1">
              <label className="font-bold text-sm text-black">Hold Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., VIP Guest List, Sponsor Block"
                className="w-full h-[47px] px-4 text-sm text-black placeholder:text-gray bg-white border border-neutral-200 rounded-[14px] focus:outline-none focus:border-tp-blue transition-colors duration-200 ease"
                autoFocus
              />
            </div>

            {/* Hold Type Toggle */}
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm text-black">Hold Type</label>
              <div className="flex h-[44px] items-center rounded-full bg-light-gray p-1">
                <button
                  type="button"
                  onClick={() => setHoldType("internal")}
                  className={cn(
                    "flex-1 h-full px-4 rounded-full text-sm font-semibold transition-all duration-200 ease cursor-pointer flex items-center justify-center gap-2",
                    holdType === "internal"
                      ? "bg-white text-black shadow-sm"
                      : "text-gray hover:text-dark-gray"
                  )}
                >
                  <Eye className="size-4" />
                  Internal
                </button>
                <button
                  type="button"
                  onClick={() => setHoldType("password-protected")}
                  className={cn(
                    "flex-1 h-full px-4 rounded-full text-sm font-semibold transition-all duration-200 ease cursor-pointer flex items-center justify-center gap-2",
                    holdType === "password-protected"
                      ? "bg-white text-black shadow-sm"
                      : "text-gray hover:text-dark-gray"
                  )}
                >
                  <Lock className="size-4" />
                  Password Protected
                </button>
              </div>
              <p className="text-xs text-gray">
                {holdType === "internal"
                  ? "These seats are reserved for internal use and won't be visible to the public."
                  : "Share a password with select buyers to unlock these seats for purchase."}
              </p>
            </div>

            {/* Password Field (only for password-protected) */}
            {holdType === "password-protected" && (
              <div className="flex flex-col gap-2 bg-light-gray rounded-[14px] p-4">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-sm text-black">Access Code</label>
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="text-xs font-semibold text-tp-blue hover:underline cursor-pointer"
                  >
                    Generate Code
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value.toUpperCase())}
                    placeholder="Enter access code"
                    className="w-full h-[47px] px-4 pr-12 text-sm text-black placeholder:text-gray bg-white rounded-[14px] focus:outline-none focus:ring-1 focus:ring-tp-blue transition-all duration-200 ease font-mono tracking-wider"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-light-gray rounded-md transition-colors duration-200 ease cursor-pointer"
                  >
                    <Eye className={cn("size-4", showPassword ? "text-tp-blue" : "text-gray")} />
                  </button>
                </div>

                {/* Max Purchase Limit */}
                <div className="flex flex-col gap-1 mt-2">
                  <div className="flex items-center gap-2">
                    <label className="font-bold text-sm text-black">
                      Max tickets per purchase
                    </label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button type="button" className="cursor-default">
                          <Info className="w-3.5 h-3.5 text-gray" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p className="max-w-[200px]">
                          Limit how many tickets can be purchased per transaction with this code.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={maxPurchaseLimit}
                    onChange={handleLimitChange}
                    placeholder="Unlimited"
                    className="w-full h-[47px] px-4 text-sm text-black placeholder:text-gray bg-white rounded-[14px] focus:outline-none focus:ring-1 focus:ring-tp-blue transition-all duration-200 ease"
                  />
                </div>

                {/* Copy Link Button */}
                {password && (
                  <button
                    type="button"
                    onClick={copyShareableLink}
                    className="mt-2 flex items-center justify-center gap-2 h-[40px] bg-white rounded-full text-sm font-semibold text-black hover:bg-soft-gray transition-colors duration-200 ease cursor-pointer"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="size-4 text-tp-green" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="size-4" />
                        Copy Shareable Link
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* Availability Window */}
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setEnableDateRange(!enableDateRange)}
                className="flex items-center gap-2 cursor-pointer self-start"
              >
                <div
                  className={cn(
                    "w-4 h-4 rounded-[5px] border-[1.5px] flex items-center justify-center transition-colors duration-200 ease",
                    enableDateRange ? "bg-tp-blue border-tp-blue" : "border-dark-gray"
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
                <span className="text-sm font-semibold text-black">Set availability window</span>
              </button>

              {enableDateRange && (
                <div className="bg-light-gray rounded-[14px] p-4 flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    {/* Start Date */}
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-dark-gray">Start Date</label>
                      <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            className="h-[42px] px-3 bg-white rounded-[10px] flex items-center gap-2 text-sm text-left cursor-pointer hover:bg-soft-gray transition-colors duration-200 ease"
                          >
                            <CalendarIcon className="size-4 text-gray" />
                            <span className={startDate ? "text-black" : "text-gray"}>
                              {startDate ? format(startDate, "MMM d, yyyy") : "Select"}
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
                      <label className="text-xs font-semibold text-dark-gray">End Date</label>
                      <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            className="h-[42px] px-3 bg-white rounded-[10px] flex items-center gap-2 text-sm text-left cursor-pointer hover:bg-soft-gray transition-colors duration-200 ease"
                          >
                            <CalendarIcon className="size-4 text-gray" />
                            <span className={endDate ? "text-black" : "text-gray"}>
                              {endDate ? format(endDate, "MMM d, yyyy") : "Select"}
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
                            disabled={(date) => (startDate ? date < startDate : false)}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Release Action */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-dark-gray">When hold expires</label>
                    <Popover open={releasePopoverOpen} onOpenChange={setReleasePopoverOpen}>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="h-[42px] px-3 bg-white rounded-[10px] flex items-center justify-between text-sm cursor-pointer hover:bg-soft-gray transition-colors duration-200 ease"
                        >
                          <span className="text-black">
                            {RELEASE_OPTIONS.find((o) => o.value === releaseAction)?.label}
                          </span>
                          <ChevronDown className="size-4 text-gray" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[220px] p-1 rounded-[12px]" align="start">
                        {RELEASE_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              setReleaseAction(option.value);
                              setReleasePopoverOpen(false);
                            }}
                            className={cn(
                              "w-full px-3 py-2 text-left text-sm rounded-[8px] cursor-pointer transition-colors duration-200 ease",
                              releaseAction === option.value
                                ? "bg-light-gray font-semibold"
                                : "hover:bg-light-gray"
                            )}
                          >
                            {option.label}
                          </button>
                        ))}
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}
            </div>

            {/* Color Selection */}
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm text-black">Hold Color</label>
              <div className="flex items-center gap-2">
                {HOLD_COLORS.map((color) => (
                  <Tooltip key={color.value}>
                    <TooltipTrigger asChild>
                      <button
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
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>{color.label}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-1">
              <label className="font-bold text-sm text-black">Internal Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes for your team (not visible to buyers)"
                className="w-full h-[80px] px-4 py-3 text-sm text-black placeholder:text-gray bg-white border border-neutral-200 rounded-[14px] resize-none focus:outline-none focus:border-tp-blue transition-colors duration-200 ease"
              />
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center gap-3 pt-2">
              {isEditing && onDelete ? (
                <button
                  type="button"
                  onClick={onDelete}
                  className="px-4 py-2.5 text-sm font-bold text-red-500 hover:text-red-600 hover:bg-red-50 rounded-[36px] transition-colors duration-200 ease cursor-pointer"
                >
                  Remove Hold
                </button>
              ) : (
                <div />
              )}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-base font-bold text-dark-gray hover:text-black bg-light-gray hover:bg-soft-gray rounded-[36px] transition-colors duration-200 ease cursor-pointer active:scale-[0.98] transform"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-tp-purple cursor-pointer text-white font-bold text-base px-5 py-2.5 rounded-[36px] hover:bg-[#5b28d4] transition-colors duration-200 ease active:scale-[0.98] transform"
                >
                  {isEditing ? "Save Changes" : "Create Hold"}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
}
