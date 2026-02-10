"use client";

import { Minus, Plus } from "lucide-react";

interface QuantityStepperProps {
  quantity: number;
  onUpdateQuantity: (delta: number) => void;
}

export function QuantityStepper({
  quantity,
  onUpdateQuantity,
}: QuantityStepperProps) {
  const isExpanded = quantity > 0;

  return (
    <div
      className={`bg-light-gray dark:bg-[#1e1e26] h-[30px] flex items-center shrink-0 overflow-hidden rounded-full ${
        isExpanded ? "gap-2 px-2 py-1" : "w-[30px] justify-center"
      }`}
    >
      {isExpanded && (
        <button
          onClick={() => onUpdateQuantity(-1)}
          className="size-[14px] cursor-pointer flex items-center justify-center text-dark-gray dark:text-[#9ca3af] hover:text-black dark:hover:text-white transition-colors duration-200 ease shrink-0"
        >
          <Minus className="size-[14px]" strokeWidth={3} />
        </button>
      )}

      {isExpanded && (
        <div className="w-[22px] h-full bg-white dark:bg-[#0a0a0f] rounded-[6px] flex items-center justify-center shrink-0 overflow-hidden">
          <span className="font-extrabold text-sm text-black dark:text-white leading-none">
            {quantity}
          </span>
        </div>
      )}

      <button
        onClick={() => onUpdateQuantity(1)}
        className={`cursor-pointer flex items-center justify-center shrink-0 transition-colors duration-200 ease ${
          isExpanded
            ? "size-[14px] text-dark-gray dark:text-[#9ca3af] hover:text-black dark:hover:text-white"
            : "size-[30px] rounded-full text-dark-gray dark:text-[#9ca3af] hover:bg-soft-gray dark:hover:bg-[#252530]"
        }`}
      >
        <Plus className="size-[14px]" strokeWidth={3} />
      </button>
    </div>
  );
}
