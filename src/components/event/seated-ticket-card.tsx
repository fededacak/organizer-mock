"use client";

import { Check } from "lucide-react";
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
}: SeatedTicketCardProps) {
  return (
    <div className="w-full text-left rounded-[20px] p-4 shadow-[inset_0_0_0_1.5px_var(--color-tp-blue)]">
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
        {/* Always-selected indicator */}
        <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center shrink-0 bg-(--color-tp-blue)">
          <Check className="size-[14px] text-white" strokeWidth={3} />
        </div>
      </div>
    </div>
  );
}
