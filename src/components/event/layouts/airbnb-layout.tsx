"use client";

import { useRef, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
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
  // Ref and state for floating checkout button visibility
  const inlineCheckoutRef = useRef<HTMLDivElement>(null);
  const stickyContainerRef = useRef<HTMLDivElement>(null);
  const [isCheckoutVisible, setIsCheckoutVisible] = useState(true);
  const [fitsViewport, setFitsViewport] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  // Check if sticky container fits within viewport
  useEffect(() => {
    const container = stickyContainerRef.current;
    if (!container) return;

    const STICKY_TOP_OFFSET = 102;
    const BOTTOM_PADDING = 24;

    const checkFit = () => {
      const containerHeight = container.getBoundingClientRect().height;
      const availableHeight =
        window.innerHeight - STICKY_TOP_OFFSET - BOTTOM_PADDING;
      setFitsViewport(containerHeight <= availableHeight);
    };

    checkFit();

    const resizeObserver = new ResizeObserver(checkFit);
    resizeObserver.observe(container);

    window.addEventListener("resize", checkFit);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", checkFit);
    };
  }, []);

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
        <div className="flex w-[55%] flex-col gap-4">
          {sections.bannerDesktop}
          <div className="flex flex-col gap-4">
            {sections.organizer}
            {sections.spotify}
            {sections.about}
            {sections.lineup}
            {sections.map}
          </div>
        </div>

        {/* Right Column (tickets sticky) */}
        <div className="flex w-[45%] flex-col gap-4">
          {header}

          <div
            ref={stickyContainerRef}
            className={`flex flex-col gap-4 mt-4 ${fitsViewport ? "sticky top-[102px]" : ""}`}
          >
            <AirbnbTicketsContainer>
              <div className="relative">
                <div className={`overflow-y-auto flex flex-col gap-3`}>
                  {ticketsList}
                </div>
              </div>

              {sections.addons}

              <div ref={inlineCheckoutRef}>
                <CheckoutButton
                  totalTickets={ticketState.totalTickets}
                  totalPrice={ticketState.totalPrice}
                  ticketTypeCount={settings.ticketCount}
                />
              </div>
            </AirbnbTicketsContainer>
          </div>
        </div>
      </div>

      {/* Floating checkout button for desktop */}
      <div className="hidden lg:block fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
        <div className="max-w-[1062px] mx-auto px-6 flex gap-12">
          {/* Fake left column to match layout gap */}
          <div className="w-[55%]" />
          <motion.div
            className="w-[45%] pointer-events-auto"
            initial={{ y: "calc(100% + 28px)" }}
            animate={{
              y: isCheckoutVisible ? "calc(100% + 28px)" : 0,
            }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : {
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }
            }
          >
            <div className="relative pb-4 before:absolute before:-z-10 before:-inset-x-3.5 before:-top-3.5 before:bottom-0 before:rounded-t-[32px] before:border before:border-b-0 before:border-[#ececec] before:bg-white before:shadow-[0_-3px_16px_rgba(0,0,0,0.1)] before:pointer-events-none dark:before:border-[#2a2a35] dark:before:bg-[#0a0a0f] dark:before:shadow-[0_-6px_16px_rgba(0,0,0,0.4)]">
              <CheckoutButton
                totalTickets={ticketState.totalTickets}
                totalPrice={ticketState.totalPrice}
                ticketTypeCount={settings.ticketCount}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
