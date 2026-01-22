"use client";

import { useState, Suspense, useMemo } from "react";
import { ArrowRight, ArrowUpRight, MapPin } from "lucide-react";
import { format, parse } from "date-fns";
import { EventBannerCarousel } from "@/components/event-banner-carousel";
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
  SettingsProvider,
  SettingsPanel,
  AddonsSection,
  SponsorsSection,
  useEventSettings,
  type EventData,
  type Ticket,
} from "@/components/event";

interface EventPageClientProps {
  eventData: EventData;
}

export function EventPageClient({ eventData }: EventPageClientProps) {
  return (
    <SettingsProvider>
      <Suspense fallback={<EventPageSkeleton />}>
        <EventPageContent eventData={eventData} />
      </Suspense>
    </SettingsProvider>
  );
}

function EventPageContent({ eventData }: EventPageClientProps) {
  const { settings } = useEventSettings();
  const isDarkMode = settings.theme === "dark";
  const isMultiDay = settings.eventType === "multi";

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
  const [expandedTicket, setExpandedTicket] = useState<string | null>(
    "early-birds"
  );
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [ticketDayTab, setTicketDayTab] = useState<"all" | "single">("all");

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
        <main className="w-full max-w-[1062px] flex flex-col lg:flex-row gap-8 px-0 md:px-8 lg:px-6 md:pt-5 pb-8">
          {/* Desktop: Two column layout */}
          {/* Left Column - hidden on mobile, shown on desktop */}
          <div className="hidden lg:flex flex-1 flex-col gap-4">
            <EventBannerCarousel
              eventName={eventData.name}
              imageCount={settings.imageCount}
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
                <LineupSection lineup={eventData.lineup} />
              )}
            </div>
          </div>

          {/* Right Column - hidden on mobile, shown on desktop */}
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

            <div className="flex flex-col w-full pb-4 border-b border-light-gray dark:border-[#2a2a35]">
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

          {/* Mobile: Single column with correct order - hidden on desktop */}
          <div className="flex lg:hidden flex-col gap-3 w-full">
            <EventBannerCarousel
              eventName={eventData.name}
              imageCount={settings.imageCount}
            />

            <div className="flex flex-col gap-4 px-4 md:px-0">
              <EventHeader
                event={eventData}
                locationTBD={settings.locationTBD}
                showEndTime={settings.showEndTime}
                isMultiDay={isMultiDay}
              />
              {settings.showSpotify && (
                <SpotifySection playlist={eventData.playlist} />
              )}

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
                <LineupSection lineup={eventData.lineup} />
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
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#0a0a0f] px-4 py-5 lg:hidden border-t border-light-gray dark:border-[#2a2a35]">
          <CheckoutButton
            totalTickets={totalTickets}
            totalPrice={totalPrice}
            ticketTypeCount={settings.ticketCount}
          />
        </div>

        {/* Settings Panel */}
        <SettingsPanel />
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
          <MapPin className="w-5 h-5 text-dark-gray dark:text-[#9ca3af]" />
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
                className="flex items-center gap-1 group"
              >
                <p className="font-extrabold text-sm text-black dark:text-white">
                  {event.venue.name}
                </p>
                <ArrowUpRight className="w-4 h-4 text-border dark:text-[#6b7280] group-hover:text-accent motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5 transition-all duration-200 ease-out" />
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
