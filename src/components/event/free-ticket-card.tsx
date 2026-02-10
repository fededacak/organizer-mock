"use client";

import { useRef, useState, useEffect } from "react";
import type { Ticket } from "./types";
import { QuantityStepper } from "./quantity-stepper";

interface FreeTicketCardProps {
  ticket: Ticket;
  quantity: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdateQuantity: (delta: number) => void;
}

export function FreeTicketCard({
  ticket,
  quantity,
  isExpanded,
  onToggleExpand,
  onUpdateQuantity,
}: FreeTicketCardProps) {
  const isSelected = quantity > 0;
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const [isClamped, setIsClamped] = useState(false);

  useEffect(() => {
    const el = descriptionRef.current;
    if (!el || isExpanded) return;

    const checkClamped = () => {
      setIsClamped(el.scrollHeight > el.clientHeight);
    };

    const rafId = requestAnimationFrame(checkClamped);

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
            Free
          </p>
        </div>
        <QuantityStepper quantity={quantity} onUpdateQuantity={onUpdateQuantity} />
      </div>

      {/* Description */}
      {ticket.description && (
        <div className="mt-1.5">
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
              className="font-bold text-[10px] uppercase mt-1.5 hover:underline cursor-pointer"
              style={{ color: "var(--color-tp-blue)" }}
            >
              {isExpanded ? "show less" : "show more"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
