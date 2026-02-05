"use client";

import { useState } from "react";
import { ChevronDown, Info } from "lucide-react";
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

const FEE_OPTIONS = [
  { value: "pass_to_buyer", label: "Pass fees to buyer" },
  { value: "absorb", label: "Absorb fees" },
] as const;

// Platform fee percentage (example: 10%)
const PLATFORM_FEE_PERCENT = 0.1;

export type FeeOption = "pass_to_buyer" | "absorb";
export type PricingType = "paid" | "free" | "pay_what_you_want";

interface PriceSelectionCardProps {
  price: string;
  onPriceChange: (value: string) => void;
  feeOption: FeeOption;
  onFeeOptionChange: (value: FeeOption) => void;
  pricingType: PricingType;
  onPricingTypeChange: (value: PricingType) => void;
  minimumPrice: string;
  onMinimumPriceChange: (value: string) => void;
}

export function PriceSelectionCard({
  price,
  onPriceChange,
  feeOption,
  onFeeOptionChange,
  pricingType,
  onPricingTypeChange,
  minimumPrice,
  onMinimumPriceChange,
}: PriceSelectionCardProps) {
  const [feePopoverOpen, setFeePopoverOpen] = useState(false);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    // Only allow one decimal point
    const parts = value.split(".");
    if (parts.length > 2) return;
    if (parts[1] && parts[1].length > 2) return;
    onPriceChange(value);
  };

  const handleMinimumPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    // Only allow one decimal point
    const parts = value.split(".");
    if (parts.length > 2) return;
    if (parts[1] && parts[1].length > 2) return;
    onMinimumPriceChange(value);
  };

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

  return (
    <div className="bg-light-gray rounded-[20px] p-4 flex flex-col gap-3">
      {/* Pricing Type Toggle */}
      <div className="flex gap-2 w-full">
        <button
          type="button"
          onClick={() => onPricingTypeChange("paid")}
          className={`flex-1 flex items-center gap-2 p-3 rounded-[16px] bg-white border-[1.5px] cursor-pointer transition-colors duration-200 ease ${
            pricingType === "paid" ? "border-tp-blue" : "border-soft-gray"
          }`}
        >
          <span className="text-sm font-semibold text-black text-center w-full">
            Paid
          </span>
        </button>
        <button
          type="button"
          onClick={() => onPricingTypeChange("free")}
          className={`flex-1 flex items-center gap-2 p-3 rounded-[16px] bg-white border-[1.5px] cursor-pointer transition-colors duration-200 ease ${
            pricingType === "free" ? "border-tp-blue" : "border-soft-gray"
          }`}
        >
          <span className="text-sm font-semibold text-black text-center w-full">
            Free
          </span>
        </button>
        <button
          type="button"
          onClick={() => onPricingTypeChange("pay_what_you_want")}
          className={`flex-1 flex items-center gap-2 p-3 rounded-[16px] bg-white border-[1.5px] cursor-pointer transition-colors duration-200 ease ${
            pricingType === "pay_what_you_want"
              ? "border-tp-blue"
              : "border-soft-gray"
          }`}
        >
          <span className="text-sm font-semibold text-black text-center w-full">
            Flexible
          </span>
        </button>
      </div>

      {/* Pay what you want - shown when pay_what_you_want is selected */}
      {pricingType === "pay_what_you_want" && (
        <div className="flex flex-col gap-1">
          <label className="font-bold text-sm text-black">
            Minimum price ($)
          </label>
          <input
            type="text"
            inputMode="decimal"
            value={minimumPrice ? `$${minimumPrice}` : ""}
            onChange={(e) => {
              const val = e.target.value.replace("$", "");
              handleMinimumPriceChange({
                target: { value: val },
              } as React.ChangeEvent<HTMLInputElement>);
            }}
            placeholder="$0 (optional)"
            className="w-full h-[47px] px-4 text-sm text-black placeholder:text-gray bg-white rounded-[16px] focus:outline-none focus:ring-1 focus:ring-tp-blue transition-all duration-200 ease"
          />
          <p className="text-xs text-dark-gray">
            Customers will enter a price of ${minimumPrice || "0"} or more to
            continue.
          </p>
        </div>
      )}

      {/* Price per unit - only shown when paid is selected */}
      {pricingType === "paid" && (
        <>
          <div className="flex flex-col gap-1">
            <label className="font-bold text-sm text-black">
              Price per unit ($)
            </label>
            <div className="relative">
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
                placeholder="$0"
                className="w-full h-[47px] px-4 pr-[160px] text-sm text-black placeholder:text-gray bg-white rounded-[16px] focus:outline-none focus:ring-1 focus:ring-tp-blue transition-all duration-200 ease"
              />
              {/* Fee option dropdown */}
              <Popover open={feePopoverOpen} onOpenChange={setFeePopoverOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="absolute right-[5px] top-1/2 -translate-y-1/2 h-[37px] px-3 pr-2.5 bg-light-gray rounded-[12px] flex items-center gap-1.5 cursor-pointer hover:bg-soft-gray transition-colors duration-200 ease"
                  >
                    <span className="text-xs text-black font-semibold">
                      {FEE_OPTIONS.find((o) => o.value === feeOption)?.label}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 opacity-80 transition-transform duration-200 ease ${
                        feePopoverOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[150px] p-1 rounded-[12px]"
                  align="end"
                  sideOffset={4}
                >
                  {FEE_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        onFeeOptionChange(option.value);
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
              <span className="font-semibold text-xs text-black">
                You get: {formatCurrency(youGet)}
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" className="cursor-default">
                    <Info className="w-4 h-4 text-gray" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Amount you receive after fees</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <span className="text-xs font-bold text-mid-gray">|</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs text-black">
                Buyer pays: {formatCurrency(buyerPays)}
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" className="cursor-default">
                    <Info className="w-4 h-4 text-gray" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Total amount the buyer will pay</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
