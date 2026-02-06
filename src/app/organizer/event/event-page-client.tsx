"use client";

import { useState, Suspense, useMemo, useEffect } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { MapPin } from "lucide-react";
import { format, parse } from "date-fns";
import { Leva } from "leva";
import { EventBannerCarousel } from "@/components/event-banner-carousel";
import { EventBannerGrid } from "@/components/event-banner-grid";
import { MarketplaceNavbar } from "@/components/marketplace-navbar";
import { MarketplaceFooter } from "@/components/marketplace-footer";
import {
  EventPageSkeleton,
  OrganizerSection,
  SpotifySection,
  LineupSection,
  AboutSection,
  MapSection,
  HostEventPromo,
  AddonsSection,
  SponsorsSection,
  useEventControls,
  type EventData,
  type Ticket,
} from "@/components/event";
import { TicketsList } from "@/components/event/tickets-list";
import { LumaLayout } from "@/components/event/layouts/luma-layout";
import { AirbnbLayout } from "@/components/event/layouts/airbnb-layout";
import { MobileLayout } from "@/components/event/layouts/mobile-layout";
import type {
  LayoutProps,
  LayoutSections,
} from "@/components/event/layouts/types";
import { ConsumerSeatmapModal } from "@/components/consumer-seatmap";

const PRIMARY_COLOR_MAP: Record<string, string> = {
  blue: "#3399ff",
  purple: "#8B5CF6",
  pink: "#EC4899",
  orange: "#F97316",
  green: "#10B981",
  red: "#EF4444",
};

interface EventPageClientProps {
  eventData: EventData;
}

export function EventPageClient({ eventData }: EventPageClientProps) {
  return (
    <Suspense fallback={<EventPageSkeleton />}>
      <EventPageContent eventData={eventData} />
    </Suspense>
  );
}

function EventPageContent({ eventData }: EventPageClientProps) {
  const settings = useEventControls();
  const isDarkMode = settings.theme === "dark";
  const isMultiDay = settings.eventType === "multi";

  // Sync layoutVariant to URL params
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("variant", settings.layoutVariant);
    window.history.replaceState({}, "", url.toString());
  }, [settings.layoutVariant]);

  // Ticket state
  const [ticketQuantities, setTicketQuantities] = useState<
    Record<string, number>
  >({
    "early-birds": 1,
    kids: 0,
    general: 0,
    vip: 0,
    group: 0,
    "late-night": 0,
    saturday: 0,
    sunday: 0,
    "pay-what-you-want": 0,
  });
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);
  const [ticketDayTab, setTicketDayTab] = useState<"all" | "single">("all");

  // Description state
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Seatmap modal state
  const [isSeatmapModalOpen, setIsSeatmapModalOpen] = useState(false);

  const isSeatedEvent = settings.ticketType === "seated";

  // Custom prices state for PWYW tickets
  const [customPrices, setCustomPrices] = useState<Record<string, string>>({});

  // Seated ticket is always selected in seated events — no toggle
  const selectedSeatedTicketId = isSeatedEvent ? "reserved-seating" : null;
  const handleSeatedTicketSelect = (_ticketId: string) => {
    // No-op: seated ticket is always selected in a seated event
  };

  // Handle custom price change for PWYW tickets
  const handleCustomPriceChange = (ticketId: string, price: string) => {
    setCustomPrices((prev) => ({
      ...prev,
      [ticketId]: price,
    }));
  };

  // Handle tab change and expand first ticket of that category
  const handleTicketDayTabChange = (tab: "all" | "single") => {
    setTicketDayTab(tab);
    if (tab === "single" && eventData.singleDayTickets?.[0]) {
      setExpandedTicket(eventData.singleDayTickets[0].id);
    } else if (tab === "all" && eventData.tickets[0]) {
      setExpandedTicket(eventData.tickets[0].id);
    }
  };

  // Seated ticket option
  const seatedTicket: Ticket = useMemo(
    () => ({
      id: "reserved-seating",
      name: "Reserved Seating",
      price: 45,
      description: "Choose your exact seats from an interactive map.",
      isSeated: true,
    }),
    [],
  );

  // Pay What You Want ticket option
  const payWhatYouWantTicket: Ticket = useMemo(
    () => ({
      id: "pay-what-you-want",
      name: "Support the Event",
      price: 0,
      description: "Pay what you feel is fair. Every contribution helps.",
      isPayWhatYouWant: true,
      minimumPrice: settings.payWhatYouWantHasMinimum ? 5 : 0,
    }),
    [settings.payWhatYouWantHasMinimum],
  );

  // Compute displayed tickets based on settings and tab selection
  // Seated events only show the seated ticket — no GA or PWYW tickets
  const displayedTickets = useMemo(() => {
    if (isSeatedEvent) {
      return [seatedTicket];
    }

    const baseTickets =
      isMultiDay && ticketDayTab === "single"
        ? eventData.singleDayTickets || []
        : eventData.tickets.slice(0, settings.ticketCount);

    // Build special tickets array (only PWYW in GA mode)
    const specialTickets: Ticket[] = [];
    if (settings.showPayWhatYouWantTicket) {
      specialTickets.push(payWhatYouWantTicket);
    }

    return [...specialTickets, ...baseTickets];
  }, [
    eventData.tickets,
    eventData.singleDayTickets,
    settings.ticketCount,
    settings.showPayWhatYouWantTicket,
    isSeatedEvent,
    isMultiDay,
    ticketDayTab,
    seatedTicket,
    payWhatYouWantTicket,
  ]);

  // Group single day tickets by day
  const ticketsByDay = useMemo(() => {
    if (!isMultiDay || ticketDayTab !== "single") return null;

    const grouped: Record<string, Ticket[]> = {};
    for (const ticket of displayedTickets) {
      const day = ticket.day || "Other";
      if (!grouped[day]) {
        grouped[day] = [];
      }
      grouped[day].push(ticket);
    }
    return grouped;
  }, [displayedTickets, isMultiDay, ticketDayTab]);

  // Compute description based on settings
  const displayedDescription = useMemo(() => {
    if (settings.description === "none") return null;
    if (settings.description === "short") {
      const match = eventData.description.match(/^[^.!?]*[.!?]/);
      return match ? match[0].trim() : eventData.description;
    }
    return eventData.description;
  }, [eventData.description, settings.description]);

  const updateQuantity = (ticketId: string, delta: number) => {
    setTicketQuantities((prev) => ({
      ...prev,
      [ticketId]: Math.max(0, (prev[ticketId] || 0) + delta),
    }));
  };

  const totalTickets = Object.values(ticketQuantities).reduce(
    (sum, qty) => sum + qty,
    0,
  );
  const totalPrice = displayedTickets.reduce((sum, ticket) => {
    return sum + ticket.price * (ticketQuantities[ticket.id] || 0);
  }, 0);

  // Check if PWYW ticket is selected but has invalid price
  const isPwywInvalid = displayedTickets.some((ticket) => {
    if (!ticket.isPayWhatYouWant) return false;
    const quantity = ticketQuantities[ticket.id] || 0;
    if (quantity === 0) return false;
    const customPrice = parseFloat(customPrices[ticket.id] || "0") || 0;
    const minimumPrice = ticket.minimumPrice ?? 0;
    return customPrice < minimumPrice;
  });

  // Build sections object for layouts
  const sections: LayoutSections = {
    bannerDesktop:
      settings.bannerStyle === "grid" ? (
        <EventBannerGrid
          eventName={eventData.name}
          imageCount={settings.imageCount}
          layoutIdPrefix="banner-desktop"
        />
      ) : (
        <EventBannerCarousel
          eventName={eventData.name}
          imageCount={settings.imageCount}
          layoutIdPrefix="banner-desktop"
        />
      ),
    bannerMobile:
      settings.bannerStyle === "grid" ? (
        <EventBannerGrid
          eventName={eventData.name}
          imageCount={settings.imageCount}
          layoutIdPrefix="banner-mobile"
        />
      ) : (
        <EventBannerCarousel
          eventName={eventData.name}
          imageCount={settings.imageCount}
          layoutIdPrefix="banner-mobile"
        />
      ),
    bannerCarouselDesktop: (
      <EventBannerCarousel
        eventName={eventData.name}
        imageCount={settings.imageCount}
        layoutIdPrefix="banner-desktop"
      />
    ),
    bannerCarouselMobile: (
      <EventBannerCarousel
        eventName={eventData.name}
        imageCount={settings.imageCount}
        layoutIdPrefix="banner-mobile"
      />
    ),
    bannerGridDesktop: (
      <EventBannerGrid
        eventName={eventData.name}
        imageCount={settings.imageCount}
        layoutIdPrefix="banner-desktop"
      />
    ),
    bannerGridMobile: (
      <EventBannerGrid
        eventName={eventData.name}
        imageCount={settings.imageCount}
        layoutIdPrefix="banner-mobile"
      />
    ),
    organizer: (
      <OrganizerSection
        organizer={eventData.organizer}
        hideBorder={
          !settings.showSpotify &&
          !settings.showLineup &&
          !displayedDescription &&
          settings.locationTBD
        }
      />
    ),
    spotify: settings.showSpotify ? (
      <SpotifySection playlist={eventData.playlist} />
    ) : null,
    lineup: settings.showLineup ? (
      <LineupSection
        lineup={eventData.lineup}
        hideBorder={settings.locationTBD}
        displaySettings={{
          showDescription: settings.lineupHasDescription,
          showSpotify: settings.lineupHasSpotify,
          showYouTube: settings.lineupHasYouTube,
          showInstagram: settings.lineupHasInstagram,
          showTiktok: settings.lineupHasTiktok,
        }}
      />
    ) : null,
    about: displayedDescription ? (
      <AboutSection
        description={displayedDescription}
        showFull={showFullDescription}
        onToggle={() => setShowFullDescription(!showFullDescription)}
        youtubeVideoCount={settings.youtubeVideoCount}
        hideBorder={settings.locationTBD && !settings.showLineup}
      />
    ) : null,
    map: !settings.locationTBD ? <MapSection venue={eventData.venue} /> : null,
    addons: settings.showAddons ? <AddonsSection /> : null,
    sponsors: settings.showSponsors ? <SponsorsSection /> : null,
    hostPromo: <HostEventPromo />,
  };

  // Build header
  const header = (
    <EventHeader
      event={eventData}
      locationTBD={settings.locationTBD}
      showEndTime={settings.showEndTime}
      isMultiDay={isMultiDay}
    />
  );

  // Build tickets list
  const ticketsList = (
    <TicketsList
      tickets={displayedTickets}
      ticketsByDay={ticketsByDay}
      quantities={ticketQuantities}
      expandedTicket={expandedTicket}
      isMultiDay={isMultiDay}
      ticketDayTab={ticketDayTab}
      selectedSeatedTicketId={selectedSeatedTicketId}
      customPrices={customPrices}
      onQuantityChange={updateQuantity}
      onExpandToggle={(id) =>
        setExpandedTicket(expandedTicket === id ? null : id)
      }
      onTabChange={handleTicketDayTabChange}
      onSeatedTicketSelect={handleSeatedTicketSelect}
      onCustomPriceChange={handleCustomPriceChange}
    />
  );

  // Build shared layout props
  const layoutProps: LayoutProps = {
    eventData,
    settings,
    ticketState: {
      quantities: ticketQuantities,
      expandedTicket,
      displayedTickets,
      ticketsByDay,
      ticketDayTab,
      totalTickets,
      totalPrice,
      isMultiDay,
      selectedSeatedTicketId,
      customPrices,
      isPwywInvalid,
      onQuantityChange: updateQuantity,
      onExpandToggle: (id) =>
        setExpandedTicket(expandedTicket === id ? null : id),
      onTabChange: handleTicketDayTabChange,
      onSeatedTicketSelect: handleSeatedTicketSelect,
      onCustomPriceChange: handleCustomPriceChange,
      onOpenSeatmap: () => setIsSeatmapModalOpen(true),
    },
    descriptionState: {
      displayedDescription,
      showFullDescription,
      onToggleDescription: () => setShowFullDescription(!showFullDescription),
    },
    sections,
    header,
    ticketsList,
    checkoutButton: null, // Handled by each layout
  };

  // Select desktop layout based on variant
  const DesktopLayout =
    settings.layoutVariant === "luma" ? LumaLayout : AirbnbLayout;

  const primaryColorValue = PRIMARY_COLOR_MAP[settings.primaryColor];

  return (
    <div
      className={isDarkMode ? "dark" : ""}
      style={
        {
          "--color-tp-blue": primaryColorValue,
          "--primary": primaryColorValue,
        } as React.CSSProperties
      }
    >
      <div className="min-h-screen bg-white dark:bg-[#0a0a0f] flex flex-col items-center transition-colors duration-300 ease-out">
        <MarketplaceNavbar />

        {/* Main Content */}
        <main
          className={`w-full flex flex-col max-w-[1062px] lg:flex-row px-0 md:px-8 lg:px-6 md:pt-5 pb-10 ${
            settings.layoutVariant === "airbnb" ? "gap-12" : "gap-8"
          }`}
        >
          {/* Desktop Layout */}
          <DesktopLayout {...layoutProps} />

          {/* Mobile Layout */}
          <MobileLayout {...layoutProps} />
        </main>

        {/* Sponsors Section - Full width, outside of two-column layout */}
        {sections.sponsors}

        {/* Host Event Promo */}
        {sections.hostPromo}

        <MarketplaceFooter />

        {/* Leva Controls Panel */}
        <Leva
          collapsed
          titleBar={{ title: "Settings" }}
          oneLineLabels={false}
          flat={false}
          theme={{
            sizes: {
              rootWidth: "280px",
              controlWidth: "140px",
              titleBarHeight: "32px",
            },
          }}
        />

        {/* Consumer Seatmap Modal */}
        <ConsumerSeatmapModal
          isOpen={isSeatmapModalOpen}
          onClose={() => setIsSeatmapModalOpen(false)}
        />
      </div>
    </div>
  );
}

function formatTime(time: string): string {
  const parsed = parse(time, "HH:mm", new Date());
  return format(parsed, "h:mm a").toLowerCase();
}

function EventHeader({
  event,
  locationTBD,
  showEndTime,
  isMultiDay,
}: {
  event: EventData;
  locationTBD: boolean;
  showEndTime: boolean;
  isMultiDay: boolean;
}) {
  const startDate = new Date(event.date);
  const endDate = event.endDate ? new Date(event.endDate) : null;
  const startTime = formatTime(event.time);
  const endTime = event.endTime ? formatTime(event.endTime) : null;

  // Format: "Feb 22, 6:00 pm"
  const startDateTime = `${format(startDate, "MMM d")}, ${startTime}`;
  const endDateTime =
    endDate && endTime ? `${format(endDate, "MMM d")}, ${endTime}` : null;

  // Single day format (with optional end time)
  const singleDayDisplay =
    showEndTime && endTime
      ? `${format(startDate, "MMM d")}, ${startTime} - ${endTime}`
      : startDateTime;

  return (
    <div className="border-b border-light-gray dark:border-[#2a2a35] pb-6 lg:pb-4 flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h1 className="font-black text-[30px] text-black dark:text-white leading-tight">
          {event.name}
        </h1>
        {isMultiDay && endDateTime ? (
          <p className="flex items-center gap-1.5 text-sm text-dark-gray dark:text-[#9ca3af]">
            <span>{startDateTime}</span>
            <ArrowRight className="w-3.5 h-3.5" />
            <span>{endDateTime}</span>
          </p>
        ) : (
          <p className="text-sm text-dark-gray dark:text-[#9ca3af]">
            {singleDayDisplay}
          </p>
        )}
      </div>
      <div className="mt-2 flex items-start gap-3">
        <div className="shrink-0 w-11 h-11 bg-light-gray dark:bg-[#1e1e26]/50 rounded-[12px] flex items-center justify-center">
          <MapPin className="text-muted-foreground dark:text-white" size={20} />
        </div>
        <div className="flex flex-col gap-0.5 justify-center h-11">
          {locationTBD ? (
            <p className="font-extrabold text-sm text-black dark:text-white">
              Location TBD
            </p>
          ) : (
            <>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 group"
              >
                <p className="font-extrabold text-sm text-black dark:text-white">
                  {event.venue.name}
                </p>
                <ArrowUpRight className="w-4 h-4 text-accent dark:text-[#6b7280] group-hover:text-accent motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5 transition-all duration-200 ease-out" />
              </a>
              <p className="text-sm text-dark-gray dark:text-[#9ca3af]">
                {event.venue.address}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
