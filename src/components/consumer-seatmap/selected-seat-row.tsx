import { X } from "lucide-react";
import type { Seat } from "../seat-settings/types";

interface SelectedSeatRowProps {
  seat: Seat;
  onRemove: (seatId: string) => void;
  color: string;
}

export function SelectedSeatRow({
  seat,
  onRemove,
  color,
}: SelectedSeatRowProps) {
  return (
    <div className="flex items-center justify-between bg-light-gray rounded-[14px] px-2.5 py-2.5 group">
      <div className="flex items-center gap-2">
        <span
          className="w-2 self-stretch shrink-0 rounded-full"
          style={{ backgroundColor: color }}
        />
        <div className="flex flex-col gap-0.5">
          <span className="md:text-xs text-sm text-muted-foreground">
            Row {seat.row}, Seat {seat.number}
          </span>
          <span className="md:text-sm text-base font-semibold text-black">
            ${seat.price}
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onRemove(seat.id)}
        className="size-5 rounded-full flex items-center justify-center hover:bg-soft-gray transition-all duration-200 cursor-pointer"
      >
        <X className="md:size-3.5 size-4 text-muted-foreground" />
      </button>
    </div>
  );
}
