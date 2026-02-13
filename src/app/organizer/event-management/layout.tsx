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
      <div className=" h-screen shrink-0 items-center p-2.5 sticky top-0 hidden lg:flex">
        <EventManagementSidebar
          eventName={eventName}
          eventDate="Apr 12, 7:00 PM"
          eventStatus="Public"
        />
      </div>

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col gap-6 lg:px-8 pb-[72px] lg:pt-8 px-4 pt-5 w-full max-w-[1292px] mx-auto">
        {/* Page Content */}
        <div className="flex-1 w-full">{children}</div>
      </main>
    </div>
  );
}
