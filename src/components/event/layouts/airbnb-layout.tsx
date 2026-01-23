"use client";

import { useRef, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { LayoutProps } from "./types";
import { CheckoutButton } from "../checkout-button";

function AirbnbTicketsContainer({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex flex-col gap-4 before:absolute before:-inset-3.5 before:rounded-[32px] before:border before:border-[#ececec] before:shadow-[0_6px_16px_rgba(0,0,0,0.12)] before:pointer-events-none dark:before:border-[#2a2a35] dark:before:shadow-[0_6px_16px_rgba(0,0,0,0.4)]">
      {children}
    </div>
  );
}

export function AirbnbLayout({
  settings,
  ticketState,
  sections,
  header,
  ticketsList,
}: LayoutProps) {
  // Refs and state for scroll gradient visibility
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);

  // Check if scroll container is scrollable
  useEffect(() => {
    const checkScrollable = () => {
      if (scrollRef.current) {
        setIsScrollable(
          scrollRef.current.scrollHeight > scrollRef.current.clientHeight
        );
      }
    };

    checkScrollable();

    // Re-check on resize
    const resizeObserver = new ResizeObserver(checkScrollable);
    if (scrollRef.current) resizeObserver.observe(scrollRef.current);

    return () => resizeObserver.disconnect();
  }, [ticketState.displayedTickets, ticketState.expandedTicket]);

  return (
    <>
      {/* Desktop: Two column layout */}
      <div className="hidden lg:contents">
        {/* Left Column */}
        <div className="flex w-[60%] flex-col gap-4">
          {sections.bannerGridDesktop}
          <div className="flex flex-col gap-4">
            {sections.organizer}
            {sections.spotify}
            {sections.about}
            {sections.lineup}
            {sections.map}
          </div>
        </div>

        {/* Right Column (tickets sticky) */}
        <div className="flex w-[40%] flex-col gap-4">
          {header}

          <div className="sticky flex flex-col gap-4 top-[102px] mt-4">
            <AirbnbTicketsContainer>
              <div className="relative">
                <div
                  ref={scrollRef}
                  className={`${settings.showAddons ? "max-h-[calc(100vh-450px)]" : "max-h-[calc(100vh-360px)]"} overflow-y-auto flex flex-col gap-3`}
                >
                  {ticketsList}
                </div>
                {/* Gradient overlay */}
                {isScrollable && (
                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-white to-transparent dark:from-[#0a0a0f]" />
                )}
              </div>

              {sections.addons}

              <CheckoutButton
                totalTickets={ticketState.totalTickets}
                totalPrice={ticketState.totalPrice}
                ticketTypeCount={settings.ticketCount}
              />
            </AirbnbTicketsContainer>
          </div>
        </div>
      </div>
    </>
  );
}
