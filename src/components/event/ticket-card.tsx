"use client";

import { useRef, useState, useEffect } from "react";
import { Minus, Plus } from "lucide-react";
import type { Ticket } from "./types";

interface TicketCardProps {
  ticket: Ticket;
  quantity: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdateQuantity: (delta: number) => void;
}

function formatPrice(price: number) {
  return `$${price.toFixed(2).replace(/\.00$/, "")}`;
}

export function TicketCard({
  ticket,
  quantity,
  isExpanded,
  onToggleExpand,
  onUpdateQuantity,
}: TicketCardProps) {
  const isSelected = quantity > 0;
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const [isClamped, setIsClamped] = useState(false);

  useEffect(() => {
    const el = descriptionRef.current;
    if (!el || isExpanded) return;

    // Use ResizeObserver to reliably detect when layout is stable
    const checkClamped = () => {
      setIsClamped(el.scrollHeight > el.clientHeight);
    };

    // Check immediately after first paint
    const rafId = requestAnimationFrame(checkClamped);

    // Also observe for size changes (handles font loading, hydration, etc.)
    const resizeObserver = new ResizeObserver(checkClamped);
    resizeObserver.observe(el);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
    };
  }, [ticket.description, isExpanded]);

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
            {formatPrice(ticket.price)}
          </p>
        </div>
        {/* Quantity Stepper or Add Button */}
        {isSelected ? (
          <div className="bg-light-gray dark:bg-[#1e1e26] rounded-full h-[30px] flex items-center justify-center gap-2 px-2 py-1 shrink-0">
            <button
              onClick={() => onUpdateQuantity(-1)}
              className="size-[14px] cursor-pointer flex items-center justify-center text-dark-gray dark:text-[#9ca3af] hover:text-black dark:hover:text-white transition-colors duration-200 ease shrink-0"
            >
              <Minus className="size-[14px]" strokeWidth={3} />
            </button>
            <div className="w-[22px] h-full bg-white dark:bg-[#0a0a0f] rounded-[6px] flex items-center justify-center shrink-0">
              <span className="font-extrabold text-sm text-black dark:text-white leading-none">
                {quantity}
              </span>
            </div>
            <button
              onClick={() => onUpdateQuantity(1)}
              className="size-[14px] cursor-pointer flex items-center justify-center text-dark-gray dark:text-[#9ca3af] hover:text-black dark:hover:text-white transition-colors duration-200 ease shrink-0"
            >
              <Plus className="size-[14px]" strokeWidth={3} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => onUpdateQuantity(1)}
            className="w-[30px] h-[30px] cursor-pointer rounded-full bg-light-gray dark:bg-[#1e1e26] flex items-center justify-center hover:bg-soft-gray dark:hover:bg-[#252530] transition-colors duration-200 ease"
          >
            <Plus
              className="size-[14px] text-dark-gray dark:text-[#9ca3af]"
              strokeWidth={3}
            />
          </button>
        )}
      </div>

      {/* Description */}
      {ticket.description && (
        <div className="mt-2.5">
          <p
            ref={descriptionRef}
            className="text-sm text-dark-gray dark:text-[#9ca3af] leading-relaxed"
            style={
              isExpanded
                ? undefined
                : {
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical" as const,
                    overflow: "hidden",
                  }
            }
          >
            {ticket.description}
          </p>
          {isClamped && (
            <button
              onClick={onToggleExpand}
              className="font-bold text-[10px] text-tp-blue uppercase mt-1.5 hover:underline cursor-pointer"
            >
              {isExpanded ? "show less" : "show more"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
