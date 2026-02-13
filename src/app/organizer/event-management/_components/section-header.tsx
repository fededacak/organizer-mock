import { Plus } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  description?: string;
  onAdd?: () => void;
  actionLabel?: string;
  actionIcon?: React.ReactNode;
}

export function SectionHeader({
  title,
  description,
  onAdd,
  actionLabel,
  actionIcon,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-1.5 mb-6">
      <div className="flex items-center justify-between gap-x-3 gap-y-1 flex-wrap">
        <div className="flex items-center gap-3">
          <h2 className="font-outfit text-xl font-extrabold text-black">
            {title}
          </h2>
          {onAdd && (
            <button
              onClick={onAdd}
              className="flex size-7 items-center justify-center rounded-full bg-mid-gray transition-colors duration-200 ease hover:bg-tp-green cursor-pointer"
              aria-label={`Add ${title.toLowerCase()}`}
            >
              <Plus className="size-5 text-white" strokeWidth={2.5} />
            </button>
          )}
        </div>
        {actionLabel && (
          <button className="flex items-center gap-1.5 text-sm font-bold text-tp-blue transition-opacity duration-200 ease hover:opacity-75">
            {actionLabel}
            {actionIcon}
          </button>
        )}
      </div>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
