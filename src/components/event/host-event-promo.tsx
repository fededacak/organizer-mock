import { ArrowUpRight } from "lucide-react";

export function HostEventPromo() {
  return (
    <div className="w-full bg-light-gray/50 dark:bg-[#1e1e26]/50 py-4 mx-auto">
      <a
        href="#"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-1.5 group"
      >
        <span className="font-semibold text-sm text-shimmer dark:text-[#9ca3af]">
          Host your event with TickPick
        </span>
        <ArrowUpRight className="w-4 h-4 text-border dark:text-[#6b7280] group-hover:text-accent motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5 transition-all duration-200 ease-out" />
      </a>
    </div>
  );
}
