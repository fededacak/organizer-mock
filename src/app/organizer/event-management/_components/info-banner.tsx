import { AlertCircle } from "lucide-react";

export function InfoBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 rounded-[14px] bg-tp-orange/10 px-4 py-3">
      <AlertCircle className="mt-0.5 size-3.5 shrink-0 text-tp-orange" />
      <span className=" text-xs leading-snug text-black">{children}</span>
    </div>
  );
}
