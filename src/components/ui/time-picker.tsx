"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TimePickerProps {
  value?: string;
  onChange?: (time: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  allowClear?: boolean;
}

// Generate time slots in 30-minute increments
function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const period = hour >= 12 ? "PM" : "AM";
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const displayMinute = minute.toString().padStart(2, "0");
      slots.push(`${displayHour}:${displayMinute} ${period}`);
    }
  }
  return slots;
}

const TIME_SLOTS = generateTimeSlots();

function TimePicker({
  value,
  onChange,
  placeholder = "Select time",
  disabled = false,
  className,
  allowClear = false,
}: TimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const selectedRef = React.useRef<HTMLButtonElement>(null);

  // Scroll to selected time when popover opens
  React.useEffect(() => {
    if (open && selectedRef.current) {
      selectedRef.current.scrollIntoView({ block: "center" });
    }
  }, [open]);

  const handleSelect = (time: string | undefined) => {
    onChange?.(time);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <button
          className={cn(
            "flex-1 h-10 bg-light-gray rounded-[10px] flex items-center justify-center px-4 gap-1 overflow-hidden hover:bg-soft-gray transition-colors duration-200 ease cursor-pointer",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
        >
          <span
            className={cn(
              "font-bold text-base truncate",
              value ? "text-black" : "text-gray"
            )}
          >
            {value || placeholder}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[140px] rounded-[20px] overflow-hidden p-0"
        align="end"
        sideOffset={8}
      >
        <div className="max-h-[280px] overflow-y-auto p-1">
          {allowClear && (
            <button
              onClick={() => handleSelect(undefined)}
              className={cn(
                "w-full px-4 py-2 text-sm font-medium text-center transition-colors duration-200 ease select-none rounded-[16px]",
                !value
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-light-gray text-gray"
              )}
            >
              Not set
            </button>
          )}
          {TIME_SLOTS.map((time) => {
            const isSelected = time === value;
            return (
              <button
                key={time}
                ref={isSelected ? selectedRef : null}
                onClick={() => handleSelect(time)}
                className={cn(
                  "w-full px-4 py-2 text-sm font-medium text-center transition-colors duration-200 ease select-none rounded-[16px]",
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-light-gray text-black"
                )}
              >
                {time}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export { TimePicker };
