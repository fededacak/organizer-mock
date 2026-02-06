import React from "react";
import Link from "next/link";
import { ChevronRight, ExternalLink } from "lucide-react";
import { EventManagementSidebar } from "@/components/event-management-sidebar";

interface EventManagementLayoutProps {
  children: React.ReactNode;
}

export default function EventManagementLayout({
  children,
}: EventManagementLayoutProps) {
  // In a real app, this would come from context or a data fetch
  const eventName = "Illuminate Nights";

  return (
    <div className="flex min-h-screen w-full bg-light-gray">
      {/* Sidebar Container */}
      <div className="flex h-screen shrink-0 items-center p-2.5 sticky top-0">
        <EventManagementSidebar
          eventName={eventName}
          eventDate="Apr 12, 7:00 PM"
          eventStatus="Public"
        />
      </div>

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col gap-6 px-8 pb-[72px] pt-5 w-full max-w-[1292px] mx-auto">
        {/* Header Row: Breadcrumb + View Event */}
        <div className="flex items-center justify-between w-full">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1">
            <Link
              href="/organizer/home"
              className="font-open-sans text-sm font-semibold text-gray transition-colors duration-200 ease hover:text-dark-gray"
            >
              Events
            </Link>
            <ChevronRight className="size-3.5 text-gray" />
            <span className="font-open-sans text-sm font-semibold text-black">
              {eventName}
            </span>
          </nav>

          {/* View Event Link */}
          <Link
            href={`/organizer/event/${eventName
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
            className="flex items-center gap-2 rounded-full transition-colors duration-200 ease hover:opacity-80"
          >
            <span className="font-outfit text-sm font-bold text-tp-blue">
              View Event
            </span>
            <ExternalLink className="size-4 text-tp-blue" />
          </Link>
        </div>

        {/* Page Content */}
        <div className="flex-1 w-full">{children}</div>
      </main>
    </div>
  );
}
