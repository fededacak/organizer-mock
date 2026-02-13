import { Pencil } from "lucide-react";

interface TransferPolicyBadgeProps {
  label: string;
  description?: string;
  allowed: boolean;
  onEdit: () => void;
}

export function TransferPolicyBadge({
  label,
  description,
  allowed,
  onEdit,
}: TransferPolicyBadgeProps) {
  return (
    <div className="flex items-center justify-between rounded-[16px] bg-light-gray px-4 py-3 gap-3">
      <div className="flex items-center gap-2.5">
        <span
          aria-label={allowed ? "Transfers allowed" : "Transfers disabled"}
          className={`size-2.5 shrink-0 rounded-full ${
            allowed ? "bg-tp-green status-dot" : "bg-tp-red"
          }${description ? " self-start lg:mt-[5px] mt-[7px]" : ""}`}
        />
        <div className="flex flex-col gap-1">
          <span className="lg:text-sm text-base font-semibold text-black">
            {label}
          </span>
          {description && (
            <span className="lg:text-sm text-base text-muted-foreground">
              {description}
            </span>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={onEdit}
        aria-label="Edit transfer settings"
        className="flex size-7 items-center justify-center shrink-0 rounded-[8px] border text-dark-gray transition-colors duration-200 ease hover:bg-soft-gray focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tp-blue/50 cursor-pointer"
      >
        <Pencil className="size-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}
