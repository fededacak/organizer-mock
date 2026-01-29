import { cn } from "@/lib/utils";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export function Checkbox({ checked, onChange, className }: CheckboxProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "size-[14px] shrink-0 rounded-[4px] border-[1.5px] transition-colors duration-200 ease cursor-pointer",
        checked
          ? "border-tp-blue bg-tp-blue"
          : "border-gray bg-transparent hover:border-dark-gray",
        className,
      )}
      aria-checked={checked}
      role="checkbox"
    >
      {checked && (
        <svg
          className="size-full text-white"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.5 4L5.5 10L2.5 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
