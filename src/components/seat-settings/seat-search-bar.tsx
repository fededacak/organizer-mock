import { Search } from "lucide-react";

interface SeatSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SeatSearchBar({
  value,
  onChange,
  placeholder = "Search by ticket name",
}: SeatSearchBarProps) {
  return (
    <div className="relative flex w-full items-center gap-4 rounded-full border border-border bg-white h-[46px]">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 font-outfit text-sm text-black placeholder:text-gray outline-none bg-transparent h-full px-4"
      />
      <button
        type="button"
        className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-tp-blue transition-transform duration-200 ease-out hover:scale-105 active:scale-95"
        aria-label="Search"
      >
        <Search className="size-3.5 text-white" strokeWidth={3} />
      </button>
    </div>
  );
}
