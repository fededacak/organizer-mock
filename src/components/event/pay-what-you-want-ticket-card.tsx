"use client";

import { useState } from "react";
import type { Ticket } from "./types";
import { QuantityStepper } from "./quantity-stepper";

interface PayWhatYouWantTicketCardProps {
  ticket: Ticket;
  quantity: number;
  onUpdateQuantity: (delta: number) => void;
  customPrice: string;
  onPriceChange: (price: string) => void;
}

function formatPrice(price: number) {
  return `$${price.toFixed(2).replace(/\.00$/, "")}`;
}

export function PayWhatYouWantTicketCard({
  ticket,
  quantity,
  onUpdateQuantity,
  customPrice,
  onPriceChange,
}: PayWhatYouWantTicketCardProps) {
  const [isFocused, setIsFocused] = useState(false);

  const isSelected = quantity > 0;
  const minimumPrice = ticket.minimumPrice ?? 0;
  const currentPrice = parseFloat(customPrice) || 0;
  const isValidPrice = currentPrice >= minimumPrice;

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    // Only allow one decimal point
    const parts = value.split(".");
    if (parts.length > 2) return;
    if (parts[1] && parts[1].length > 2) return;
    onPriceChange(value);
  };

  return (
    <div
      className={`rounded-[20px] p-4 transition-shadow duration-200 ease ${
        isSelected
          ? "shadow-[inset_0_0_0_1.5px_var(--color-tp-blue)]"
          : "shadow-[inset_0_0_0_1px_#e5e5e5] dark:shadow-[inset_0_0_0_1px_#2a2a35]"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p className="font-bold text-sm text-black dark:text-white">
            {ticket.name}
          </p>
          <p className="font-black text-xl text-black dark:text-white mt-1.5">
            {minimumPrice > 0
              ? `From ${formatPrice(minimumPrice)}`
              : "Name your price"}
          </p>
        </div>
        <QuantityStepper quantity={quantity} onUpdateQuantity={onUpdateQuantity} />
      </div>

      {/* Description */}
      {ticket.description && (
        <p className="text-sm text-dark-gray dark:text-[#9ca3af] mt-2.5 leading-relaxed">
          {ticket.description}
        </p>
      )}

      {/* Price input - shown when selected */}
      {isSelected && (
        <div className="mt-2.5 flex flex-col gap-1.5">
          <label className="font-bold text-sm text-black dark:text-white">
            Enter your amount
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="decimal"
              value={customPrice ? `$${customPrice}` : ""}
              onChange={(e) => {
                const val = e.target.value.replace("$", "");
                handlePriceChange({
                  target: { value: val },
                } as React.ChangeEvent<HTMLInputElement>);
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={`$${minimumPrice} or more`}
              className={`w-full h-[47px] px-4 text-sm text-black dark:text-white placeholder:text-gray dark:placeholder:text-[#6b7280] bg-light-gray dark:bg-[#1e1e26] rounded-[16px] focus:outline-none transition-all duration-200 ease ${
                isFocused
                  ? "ring-1 ring-(--color-tp-blue)"
                  : !isValidPrice && customPrice
                  ? "ring-1 ring-red-500"
                  : ""
              }`}
            />
          </div>
          {!isValidPrice && customPrice && (
            <p className="text-xs text-red-500">
              Minimum amount is {formatPrice(minimumPrice)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
