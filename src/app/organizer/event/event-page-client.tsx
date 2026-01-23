"use client";

import { useState, Suspense, useMemo, useRef, useEffect } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { MapPinIcon } from "@/components/icons/map-pin-icon";
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
  TicketCard,
  CheckoutButton,
  AboutSection,
  MapSection,
  HostEventPromo,
  AddonsSection,
  SponsorsSection,
  useEventControls,
  type EventData,
  type Ticket,
} from "@/components/event";

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
  });
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [ticketDayTab, setTicketDayTab] = useState<"all" | "single">("all");

  // Refs and state for scroll gradient visibility (airbnb layout only)
  const airbnbScrollRef = useRef<HTMLDivElement>(null);
  const [isAirbnbScrollable, setIsAirbnbScrollable] = useState(false);

  // Ref and state for floating checkout button visibility (original layout)
  const inlineCheckoutRef = useRef<HTMLDivElement>(null);
  const [isCheckoutVisible, setIsCheckoutVisible] = useState(true);

  // Handle tab change and expand first ticket of that category
  const handleTicketDayTabChange = (tab: "all" | "single") => {
    setTicketDayTab(tab);
    if (tab === "single" && eventData.singleDayTickets?.[0]) {
      setExpandedTicket(eventData.singleDayTickets[0].id);
    } else if (tab === "all" && eventData.tickets[0]) {
      setExpandedTicket(eventData.tickets[0].id);
    }
  };

  // Compute displayed tickets based on settings and tab selection
  const displayedTickets = useMemo(() => {
    if (isMultiDay && ticketDayTab === "single") {
      return eventData.singleDayTickets || [];
    }
    return eventData.tickets.slice(0, settings.ticketCount);
  }, [eventData.tickets, eventData.singleDayTickets, settings.ticketCount, isMultiDay, ticketDayTab]);

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
      // Extract first sentence (ends with . ! or ?)
      const match = eventData.description.match(/^[^.!?]*[.!?]/);
      return match ? match[0].trim() : eventData.description;
    }
    // Line-based truncation is handled by AboutSection with line-clamp
    return eventData.description;
  }, [eventData.description, settings.description]);

  // Check if scroll container is scrollable (airbnb layout only)
  useEffect(() => {
    const checkScrollable = () => {
      if (airbnbScrollRef.current) {
        setIsAirbnbScrollable(
          airbnbScrollRef.current.scrollHeight > airbnbScrollRef.current.clientHeight
        );
      }
    };

    checkScrollable();

    // Re-check on resize
    const resizeObserver = new ResizeObserver(checkScrollable);
    if (airbnbScrollRef.current) resizeObserver.observe(airbnbScrollRef.current);

    return () => resizeObserver.disconnect();
  }, [displayedTickets, expandedTicket]);

  // Track visibility of inline checkout button (original layout only)
  useEffect(() => {
    if (settings.layoutVariant !== "default") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsCheckoutVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (inlineCheckoutRef.current) {
      observer.observe(inlineCheckoutRef.current);
    }

    return () => observer.disconnect();
  }, [settings.layoutVariant]);

  const updateQuantity = (ticketId: string, delta: number) => {
    setTicketQuantities((prev) => ({
      ...prev,
      [ticketId]: Math.max(0, (prev[ticketId] || 0) + delta),
    }));
  };

  const totalTickets = Object.values(ticketQuantities).reduce(
    (sum, qty) => sum + qty,
    0
  );
  const totalPrice = displayedTickets.reduce((sum, ticket) => {
    return sum + ticket.price * (ticketQuantities[ticket.id] || 0);
  }, 0);

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen bg-white dark:bg-[#0a0a0f] flex flex-col items-center transition-colors duration-300 ease-out">
        <MarketplaceNavbar isDarkMode={isDarkMode} />

        {/* Main Content */}
        <main className={`w-full flex flex-col max-w-[1062px] lg:flex-row px-0 md:px-8 lg:px-6 md:pt-5 pb-8 ${settings.layoutVariant === "airbnb-experiences" ? "gap-12" : "gap-8"}`}>
          {/* Desktop: Two column layout */}
          {settings.layoutVariant === "default" ? (
            <>
              {/* Original Layout - Left Column */}
              <div className="hidden lg:flex flex-1 flex-col gap-4">
                <EventBannerCarousel
                  eventName={eventData.name}
                  imageCount={settings.imageCount}
                  layoutIdPrefix="banner-desktop"
                />
                <div className="flex flex-col gap-4">
                  <OrganizerSection
                    organizer={eventData.organizer}
                    hideBorder={!settings.showSpotify && !settings.showLineup}
                  />
                  {settings.showSpotify && (
                    <SpotifySection playlist={eventData.playlist} />
                  )}
                  {settings.showLineup && (
                    <LineupSection lineup={eventData.lineup} hideBorder />
                  )}
                </div>
              </div>

              {/* Original Layout - Right Column (not sticky) */}
              <div className="hidden lg:flex w-[500px] flex-col gap-4">
                <EventHeader event={eventData} locationTBD={settings.locationTBD} showEndTime={settings.showEndTime} isMultiDay={isMultiDay} />

                <div className="flex flex-col gap-3">
                  {isMultiDay && (
                    <TicketDayTabs
                      activeTab={ticketDayTab}
                      onTabChange={handleTicketDayTabChange}
                    />
                  )}
                  {ticketsByDay ? (
                    Object.entries(ticketsByDay).map(([day, tickets]) => (
                      <div key={day} className="flex flex-col gap-2.5">
                        <p className="font-extrabold text-sm text-black dark:text-white">
                          {day}
                        </p>
                        {tickets.map((ticket) => (
                          <TicketCard
                            key={ticket.id}
                            ticket={ticket}
                            quantity={ticketQuantities[ticket.id] || 0}
                            isExpanded={expandedTicket === ticket.id}
                            onToggleExpand={() =>
                              setExpandedTicket(
                                expandedTicket === ticket.id ? null : ticket.id
                              )
                            }
                            onUpdateQuantity={(delta) => updateQuantity(ticket.id, delta)}
                          />
                        ))}
                      </div>
                    ))
                  ) : (
                    displayedTickets.map((ticket) => (
                      <TicketCard
                        key={ticket.id}
                        ticket={ticket}
                        quantity={ticketQuantities[ticket.id] || 0}
                        isExpanded={expandedTicket === ticket.id}
                        onToggleExpand={() =>
                          setExpandedTicket(
                            expandedTicket === ticket.id ? null : ticket.id
                          )
                        }
                        onUpdateQuantity={(delta) => updateQuantity(ticket.id, delta)}
                      />
                    ))
                  )}
                </div>

                {settings.showAddons && <AddonsSection />}

                <div
                  ref={inlineCheckoutRef}
                  className="flex flex-col w-full pb-4 border-b border-light-gray dark:border-[#2a2a35]"
                >
                  <CheckoutButton
                    totalTickets={totalTickets}
                    totalPrice={totalPrice}
                    ticketTypeCount={settings.ticketCount}
                  />
                </div>

                {displayedDescription && (
                  <AboutSection
                    description={displayedDescription}
                    showFull={showFullDescription}
                    onToggle={() => setShowFullDescription(!showFullDescription)}
                    youtubeVideoCount={settings.youtubeVideoCount}
                    hideBorder={settings.locationTBD}
                  />
                )}

                {!settings.locationTBD && <MapSection venue={eventData.venue} />}
              </div>
            </>
          ) : (
            <>
              {/* Airbnb Experiences Layout - Left Column */}
              <div className="hidden lg:flex w-[60%] flex-col gap-4">
                <EventBannerGrid
                  eventName={eventData.name}
                  imageCount={settings.imageCount}
                  layoutIdPrefix="banner-desktop"
                />
                <div className="flex flex-col gap-4">
                  <OrganizerSection
                    organizer={eventData.organizer}
                    hideBorder={!settings.showSpotify && !settings.showLineup && !displayedDescription && settings.locationTBD}
                  />
                  {settings.showSpotify && (
                    <SpotifySection playlist={eventData.playlist} />
                  )}
                  {displayedDescription && (
                    <AboutSection
                      description={displayedDescription}
                      showFull={showFullDescription}
                      onToggle={() => setShowFullDescription(!showFullDescription)}
                      youtubeVideoCount={settings.youtubeVideoCount}
                      hideBorder={!settings.showLineup && settings.locationTBD}
                    />
                  )}
                  {settings.showLineup && (
                    <LineupSection lineup={eventData.lineup} hideBorder={settings.locationTBD} />
                  )}
                  {!settings.locationTBD && <MapSection venue={eventData.venue} />}
                </div>
              </div>

              {/* Airbnb Experiences Layout - Right Column (tickets sticky) */}
              <div className="hidden lg:flex w-[40%] flex-col gap-4">
                <EventHeader event={eventData} locationTBD={settings.locationTBD} showEndTime={settings.showEndTime} isMultiDay={isMultiDay} />

                <div className={`sticky flex flex-col gap-4 ${settings.layoutVariant === "airbnb-experiences" ? "top-[102px] mt-4" : "top-[88px]"}`}>
                  <AirbnbTicketsContainer>
                    <div className="relative">
                      <div
                        ref={airbnbScrollRef}
                        className={`${settings.showAddons ? "max-h-[calc(100vh-450px)]" : "max-h-[calc(100vh-360px)]"} overflow-y-auto flex flex-col gap-3`}
                      >
                        {isMultiDay && (
                          <TicketDayTabs
                            activeTab={ticketDayTab}
                            onTabChange={handleTicketDayTabChange}
                          />
                        )}
                        {ticketsByDay ? (
                          Object.entries(ticketsByDay).map(([day, tickets]) => (
                            <div key={day} className="flex flex-col gap-2.5">
                              <p className="font-extrabold text-sm text-black dark:text-white">
                                {day}
                              </p>
                              {tickets.map((ticket) => (
                                <TicketCard
                                  key={ticket.id}
                                  ticket={ticket}
                                  quantity={ticketQuantities[ticket.id] || 0}
                                  isExpanded={expandedTicket === ticket.id}
                                  onToggleExpand={() =>
                                    setExpandedTicket(
                                      expandedTicket === ticket.id ? null : ticket.id
                                    )
                                  }
                                  onUpdateQuantity={(delta) => updateQuantity(ticket.id, delta)}
                                />
                              ))}
                            </div>
                          ))
                        ) : (
                          displayedTickets.map((ticket) => (
                            <TicketCard
                              key={ticket.id}
                              ticket={ticket}
                              quantity={ticketQuantities[ticket.id] || 0}
                              isExpanded={expandedTicket === ticket.id}
                              onToggleExpand={() =>
                                setExpandedTicket(
                                  expandedTicket === ticket.id ? null : ticket.id
                                )
                              }
                              onUpdateQuantity={(delta) => updateQuantity(ticket.id, delta)}
                            />
                          ))
                        )}
                      </div>
                      {/* Gradient overlay */}
                      {isAirbnbScrollable && (
                        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent dark:from-[#0a0a0f]" />
                      )}
                    </div>

                    {settings.showAddons && <AddonsSection />}

                    <CheckoutButton
                      totalTickets={totalTickets}
                      totalPrice={totalPrice}
                      ticketTypeCount={settings.ticketCount}
                    />
                  </AirbnbTicketsContainer>
                </div>
              </div>
            </>
          )}

          {/* Mobile: Single column with correct order - hidden on desktop */}
          <div className="flex lg:hidden flex-col gap-3 w-full">
            {settings.layoutVariant === "airbnb-experiences" ? (
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
            )}

            <div className="flex flex-col gap-4 px-4 md:px-0">
              <EventHeader
                event={eventData}
                locationTBD={settings.locationTBD}
                showEndTime={settings.showEndTime}
                isMultiDay={isMultiDay}
              />

              <div className="flex flex-col gap-3">
                {isMultiDay && (
                  <TicketDayTabs
                    activeTab={ticketDayTab}
                    onTabChange={handleTicketDayTabChange}
                  />
                )}
                {ticketsByDay ? (
                  Object.entries(ticketsByDay).map(([day, tickets]) => (
                    <div key={day} className="flex flex-col gap-2.5">
                      <p className="font-extrabold text-sm text-black dark:text-white">
                        {day}
                      </p>
                      {tickets.map((ticket) => (
                        <TicketCard
                          key={ticket.id}
                          ticket={ticket}
                          quantity={ticketQuantities[ticket.id] || 0}
                          isExpanded={expandedTicket === ticket.id}
                          onToggleExpand={() =>
                            setExpandedTicket(
                              expandedTicket === ticket.id ? null : ticket.id
                            )
                          }
                          onUpdateQuantity={(delta) =>
                            updateQuantity(ticket.id, delta)
                          }
                        />
                      ))}
                    </div>
                  ))
                ) : (
                  displayedTickets.map((ticket) => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      quantity={ticketQuantities[ticket.id] || 0}
                      isExpanded={expandedTicket === ticket.id}
                      onToggleExpand={() =>
                        setExpandedTicket(
                          expandedTicket === ticket.id ? null : ticket.id
                        )
                      }
                      onUpdateQuantity={(delta) =>
                        updateQuantity(ticket.id, delta)
                      }
                    />
                  ))
                )}
              </div>

              {settings.showAddons && (
                <div className="flex flex-col w-full pb-4 border-b border-light-gray dark:border-[#2a2a35]">
                  <AddonsSection />
                </div>
              )}

              {settings.showSpotify && (
                <SpotifySection playlist={eventData.playlist} />
              )}

              <OrganizerSection
                organizer={eventData.organizer}
                hideBorder={!displayedDescription && settings.locationTBD && !settings.showLineup}
              />

              {displayedDescription && (
                <AboutSection
                  description={displayedDescription}
                  showFull={showFullDescription}
                  onToggle={() => setShowFullDescription(!showFullDescription)}
                  youtubeVideoCount={settings.youtubeVideoCount}
                  hideBorder={settings.locationTBD && !settings.showLineup}
                />
              )}
              {!settings.locationTBD && <MapSection venue={eventData.venue} />}
              {settings.showLineup && (
                <LineupSection lineup={eventData.lineup} hideBorder />
              )}
            </div>
          </div>
        </main>

        {/* Sponsors Section - Full width, outside of two-column layout */}
        {settings.showSponsors && <SponsorsSection />}

        {/* Host Event Promo */}
        <HostEventPromo />

        <MarketplaceFooter />

        {/* Fixed checkout button for mobile */}
        <div className="fixed bottom-2 left-2 right-2 bg-white dark:bg-[#0a0a0f] shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] rounded-full p-3 lg:hidden border-t border-light-gray dark:border-[#2a2a35]">
          <CheckoutButton
            totalTickets={totalTickets}
            totalPrice={totalPrice}
            ticketTypeCount={settings.ticketCount}
          />
        </div>

        {/* Floating checkout button for desktop original layout */}
        {settings.layoutVariant === "default" && (
          <div className="hidden lg:block fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
            <div className="max-w-[1092px] mx-auto px-6 flex justify-end">
              <div
                className={`w-[532px] pointer-events-auto transition-all duration-300 motion-reduce:transition-none ${
                  isCheckoutVisible
                    ? "opacity-0 translate-y-4"
                    : "opacity-100 translate-y-0"
                }`}
                style={{ transitionTimingFunction: "cubic-bezier(.215, .61, .355, 1)" }}
              >
                <div className="bg-white dark:bg-[#0a0a0f] rounded-t-[24px] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] border border-light-gray dark:border-[#2a2a35]">
                  <CheckoutButton
                    totalTickets={totalTickets}
                    totalPrice={totalPrice}
                    ticketTypeCount={settings.ticketCount}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Leva Controls Panel */}
        <Leva
          collapsed={false}
          oneLineLabels={false}
          flat={false}
          theme={{
            sizes: {
              rootWidth: "320px",
              controlWidth: "160px",
            },
          }}
        />
      </div>
    </div>
  );
}

function TicketDayTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: "all" | "single";
  onTabChange: (tab: "all" | "single") => void;
}) {
  return (
    <div className="flex bg-light-gray dark:bg-[#1e1e26] p-1.5 rounded-[16px] shadow-[0px_4px_24px_0px_rgba(155,182,190,0.07)]">
      <button
        onClick={() => onTabChange("all")}
        className={`flex-1 px-4 py-2 text-sm font-bold rounded-[12px] transition-colors duration-200 ease-out cursor-pointer ${
          activeTab === "all"
            ? "bg-primary text-white"
            : "text-dark-gray dark:text-[#9ca3af] hover:text-black dark:hover:text-white"
        }`}
      >
        All Days
      </button>
      <button
        onClick={() => onTabChange("single")}
        className={`flex-1 px-4 py-2 text-sm font-semibold rounded-[12px] transition-colors duration-200 ease-out cursor-pointer ${
          activeTab === "single"
            ? "bg-primary text-white"
            : "text-dark-gray dark:text-[#9ca3af] hover:text-black dark:hover:text-white"
        }`}
      >
        Single Day
      </button>
    </div>
  );
}

function formatTime(time: string): string {
  const parsed = parse(time, "HH:mm", new Date());
  return format(parsed, "h:mm a").toLowerCase();
}

function AirbnbTicketsContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex flex-col gap-4 before:absolute before:-inset-3.5 before:rounded-[32px] before:border before:border-[#ececec] before:shadow-[0_6px_16px_rgba(0,0,0,0.12)] before:pointer-events-none dark:before:border-[#2a2a35] dark:before:shadow-[0_6px_16px_rgba(0,0,0,0.4)]">
      {children}
    </div>
  );
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
  const endDateTime = endDate && endTime
    ? `${format(endDate, "MMM d")}, ${endTime}`
    : null;

  // Single day format (with optional end time)
  const singleDayDisplay = showEndTime && endTime
    ? `${format(startDate, "MMM d")}, ${startTime} - ${endTime}`
    : startDateTime;

  return (
    <div className="border-b border-light-gray dark:border-[#2a2a35] pb-4 flex flex-col gap-3">
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
