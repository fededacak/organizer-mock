"use client";

import { useRef, useState, useEffect } from "react";
import type { LayoutProps } from "./types";
import { CheckoutButton } from "../checkout-button";

export function LumaLayout({
  settings,
  ticketState,
  sections,
  header,
  ticketsList,
}: LayoutProps) {
  // Ref and state for floating checkout button visibility
  const inlineCheckoutRef = useRef<HTMLDivElement>(null);
  const [isCheckoutVisible, setIsCheckoutVisible] = useState(true);

  // Track visibility of inline checkout button
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsCheckoutVisible(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );

    if (inlineCheckoutRef.current) {
      observer.observe(inlineCheckoutRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Desktop: Two column layout */}
      <div className="hidden lg:contents">
        {/* Left Column */}
        <div className="flex flex-1 flex-col gap-4">
          {sections.bannerDesktop}
          <div className="flex flex-col gap-4">
            {sections.organizer}
            {sections.spotify}
            {sections.lineup}
          </div>
        </div>

        {/* Right Column (not sticky) */}
        <div className="flex w-[500px] flex-col gap-4">
          {header}

          {ticketsList}

          {sections.addons}

          <div
            ref={inlineCheckoutRef}
            className="flex flex-col w-full pb-4 border-b border-light-gray dark:border-[#2a2a35]"
          >
            <CheckoutButton
              totalTickets={ticketState.totalTickets}
              totalPrice={ticketState.totalPrice}
              ticketTypeCount={settings.ticketCount}
            />
          </div>

          {sections.about}

          {sections.map}
        </div>
      </div>

      {/* Floating checkout button for desktop */}
      <div className="hidden lg:block fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
        <div className="max-w-[1092px] mx-auto px-6 flex justify-end">
          <div
            className={`w-[532px] pointer-events-auto transition-all duration-300 motion-reduce:transition-none ${
              isCheckoutVisible
                ? "opacity-0 translate-y-4"
                : "opacity-100 translate-y-0"
            }`}
            style={{
              transitionTimingFunction: "cubic-bezier(.215, .61, .355, 1)",
            }}
          >
            <div className="bg-white dark:bg-[#0a0a0f] rounded-t-[24px] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] border border-light-gray dark:border-[#2a2a35]">
              <CheckoutButton
                totalTickets={ticketState.totalTickets}
                totalPrice={ticketState.totalPrice}
                ticketTypeCount={settings.ticketCount}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
