"use client";

import { LayoutGrid, Check } from "lucide-react";
import type { Ticket } from "./types";

interface SeatedTicketCardProps {
  ticket: Ticket;
  isSelected: boolean;
  onSelect: () => void;
}

function formatPrice(price: number) {
  return `$${price.toFixed(2).replace(/\.00$/, "")}`;
}

export function SeatedTicketCard({
  ticket,
  isSelected,
  onSelect,
}: SeatedTicketCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left rounded-[20px] p-4 transition-shadow duration-200 ease cursor-pointer ${
        isSelected
          ? "shadow-[inset_0_0_0_1.5px_var(--color-tp-blue)]"
          : "shadow-[inset_0_0_0_1px_#e5e5e5] dark:shadow-[inset_0_0_0_1px_#2a2a35]] hover:shadow-[inset_0_0_0_1px_#d1d1d1] dark:hover:shadow-[inset_0_0_0_1px_#3a3a45]"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p className="font-bold text-sm text-black dark:text-white">
            {ticket.name}
          </p>
          <p className="font-black text-xl text-black dark:text-white mt-1.5">
            {ticket.price > 0 ? `From ${formatPrice(ticket.price)}` : "Free"}
          </p>
          <p className="text-sm text-dark-gray dark:text-[#9ca3af] mt-1">
            Choose your seats on the map
          </p>
        </div>
        {/* Selection indicator */}
        <div
          className={`w-[30px] h-[30px] rounded-full flex items-center justify-center shrink-0 transition-colors duration-200 ease ${
            isSelected
              ? "bg-(--color-tp-blue)"
              : "bg-light-gray dark:bg-[#1e1e26]"
          }`}
        >
          {isSelected ? (
            <Check className="size-[14px] text-white" strokeWidth={3} />
          ) : (
            <LayoutGrid
              className="size-[14px] text-dark-gray dark:text-[#9ca3af]"
              strokeWidth={2}
            />
          )}
        </div>
      </div>
    </button>
  );
}
