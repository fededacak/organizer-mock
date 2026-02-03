"use client";

import type { LayoutProps } from "./types";
import { CheckoutButton } from "../checkout-button";

export function MobileLayout({
  settings,
  ticketState,
  sections,
  header,
  ticketsList,
}: LayoutProps) {
  return (
    <>
      {/* Mobile: Single column - hidden on desktop */}
      <div className="flex lg:hidden flex-col gap-3 w-full">
        {sections.bannerMobile}

        <div className="flex flex-col gap-6 px-4 md:px-0">
          {header}

          <div className="pb-6 border-b border-light-gray dark:border-[#2a2a35]">
            {ticketsList}
            {sections.addons && (
              <div className="flex flex-col w-full pt-3">{sections.addons}</div>
            )}
          </div>

          {sections.spotify}

          {sections.organizer}

          {sections.about}

          {sections.lineup}

          {sections.map}
        </div>
      </div>

      {/* Fixed checkout button for mobile */}
      <div className="fixed bottom-2 left-2 right-2 bg-white dark:bg-[#0a0a0f] shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] rounded-full p-3 lg:hidden border-t border-light-gray dark:border-[#2a2a35]">
        <CheckoutButton
          totalTickets={ticketState.totalTickets}
          totalPrice={ticketState.totalPrice}
          ticketTypeCount={settings.ticketCount}
          mode={ticketState.selectedSeatedTicketId ? "seats" : "checkout"}
          onSeatsClick={ticketState.onOpenSeatmap}
        />
      </div>
    </>
  );
}
