import { Plus } from "lucide-react";
import Link from "next/link";

interface HomePageHeaderProps {
  userName?: string;
}

export function HomePageHeader({ userName = "Michael" }: HomePageHeaderProps) {
  return (
    <div className="flex w-full items-center justify-between">
      <h1 className="font-outfit text-[28px] font-black text-black">
        Welcome, {userName}
      </h1>
      <Link
        href="/organizer/event-creation"
        className="flex items-center gap-2 rounded-full bg-tp-blue px-5 py-[11px] transition-colors duration-200 ease hover:bg-tp-blue/90"
      >
        <Plus className="size-4 text-white" strokeWidth={2.5} />
        <span className="font-outfit text-base font-bold text-white">
          Create Event
        </span>
      </Link>
    </div>
  );
}





