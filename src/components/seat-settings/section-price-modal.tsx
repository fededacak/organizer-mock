"use client";

import { useState, useEffect } from "react";
import { X, ChevronDown, Info } from "lucide-react";
import { motion } from "framer-motion";
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
import type { Section } from "./types";

interface SectionEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    newPrice: number,
    feeOption: "pass_to_buyer" | "absorb",
    newName?: string,
  ) => void;
  sections: Section[];
}

const FEE_OPTIONS = [
  { value: "pass_to_buyer", label: "Pass fees to buyer" },
  { value: "absorb", label: "Absorb fees" },
] as const;

// Platform fee percentage (example: 10%)
const PLATFORM_FEE_PERCENT = 0.1;

const springTransition = {
  type: "spring" as const,
  stiffness: 400,
  damping: 30,
};

export function SectionEditModal({
  isOpen,
  onClose,
  onConfirm,
  sections,
}: SectionEditModalProps) {
  const [price, setPrice] = useState("");
  const [sectionName, setSectionName] = useState("");
  const [feeOption, setFeeOption] = useState<"pass_to_buyer" | "absorb">(
    "pass_to_buyer",
  );
  const [feePopoverOpen, setFeePopoverOpen] = useState(false);

  const isSingleSection = sections.length === 1;

  // Reset fields when modal opens with new sections
  useEffect(() => {
    if (isOpen && sections.length > 0) {
      // If all sections have the same price, pre-fill it
      const prices = sections.map((s) => s.price);
      const allSame = prices.every((p) => p === prices[0]);
      if (allSame) {
        setPrice(prices[0].toString());
      } else {
        setPrice("");
      }
      setFeeOption("pass_to_buyer");

      // Pre-fill section name if only one section is selected
      if (sections.length === 1) {
        setSectionName(sections[0].name);
      } else {
        setSectionName("");
      }
    }
  }, [isOpen, sections]);

  // Calculate fees
  const priceNum = parseFloat(price) || 0;
  const platformFee = priceNum * PLATFORM_FEE_PERCENT;

  let youGet = 0;
  let buyerPays = 0;

  if (feeOption === "pass_to_buyer") {
    youGet = priceNum;
    buyerPays = priceNum + platformFee;
  } else {
    youGet = priceNum - platformFee;
    buyerPays = priceNum;
  }

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    // Only allow one decimal point
    const parts = value.split(".");
    if (parts.length > 2) return;
    if (parts[1] && parts[1].length > 2) return;
    setPrice(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericPrice = parseFloat(price);
    if (!isNaN(numericPrice) && numericPrice >= 0) {
      const trimmedName = sectionName.trim();
      onConfirm(
        numericPrice,
        feeOption,
        isSingleSection && trimmedName ? trimmedName : undefined,
      );
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const totalSeats = sections.reduce((acc, s) => acc + s.capacity, 0);

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
              Edit Section
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
            {/* Selected sections summary */}
            <div className="rounded-[14px] bg-light-gray p-4">
              <p className="text-sm text-black font-bold mb-2">
                Updating{" "}
                {isSingleSection ? "section" : `${sections.length} sections`} (
                {totalSeats} seats):
              </p>
              <div className="flex flex-wrap gap-2">
                {sections.map((section) => (
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
                      (${section.price})
                    </span>
                  </span>
                ))}
              </div>
            </div>
            {/* Section name field (only for single section) */}
            {isSingleSection && (
              <div className="flex flex-col gap-1">
                <label className="font-bold text-sm text-black">
                  Section name
                </label>
                <input
                  type="text"
                  value={sectionName}
                  onChange={(e) => setSectionName(e.target.value)}
                  placeholder="Enter section name"
                  className="w-full h-[47px] px-4 text-sm text-black placeholder:text-gray bg-white border border-neutral-200 rounded-[14px] focus:outline-none focus:border-tp-blue transition-colors duration-200 ease"
                />
              </div>
            )}

            {/* Price Section */}
            <div className="bg-light-gray rounded-[14px] p-4 flex flex-col gap-3">
              {/* Price per seat */}
              <div className="flex flex-col gap-1">
                <label className="font-bold text-sm text-black">
                  Price per seat ($)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="decimal"
                    id="price"
                    value={price ? `$${price}` : ""}
                    onChange={(e) => {
                      const val = e.target.value.replace("$", "");
                      handlePriceChange({
                        target: { value: val },
                      } as React.ChangeEvent<HTMLInputElement>);
                    }}
                    placeholder="$0.00"
                    className="w-full h-[47px] px-4 pr-[160px] text-sm text-black placeholder:text-gray bg-white rounded-[16px] focus:outline-none focus:ring-1 focus:ring-tp-blue transition-all duration-200 ease"
                  />
                  {/* Fee option dropdown */}
                  <Popover
                    open={feePopoverOpen}
                    onOpenChange={setFeePopoverOpen}
                  >
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="absolute right-[5px] top-1/2 -translate-y-1/2 h-[37px] px-3 bg-light-gray rounded-[12px] flex items-center gap-2 cursor-pointer hover:bg-soft-gray transition-colors duration-200 ease"
                      >
                        <span className="text-xs font-semibold text-black">
                          {
                            FEE_OPTIONS.find((o) => o.value === feeOption)
                              ?.label
                          }
                        </span>
                        <ChevronDown className="w-3.5 h-3.5 opacity-80" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-[180px] p-1 rounded-[12px]"
                      align="end"
                      sideOffset={4}
                    >
                      {FEE_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setFeeOption(option.value);
                            setFeePopoverOpen(false);
                          }}
                          className={`w-full px-3 py-2 text-left text-sm rounded-[8px] cursor-pointer transition-colors duration-200 ease ${
                            feeOption === option.value
                              ? "bg-light-gray font-semibold"
                              : "hover:bg-light-gray"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Summary line */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-black">
                    You get: {formatCurrency(youGet)}
                  </span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" className="cursor-default">
                        <Info className="w-3.5 h-3.5 text-gray" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Amount you receive after fees</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <span className="text-xs font-bold text-mid-gray">|</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-black">
                    Buyer pays: {formatCurrency(buyerPays)}
                  </span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" className="cursor-default">
                        <Info className="w-3.5 h-3.5 text-gray" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Total amount the buyer will pay</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
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
