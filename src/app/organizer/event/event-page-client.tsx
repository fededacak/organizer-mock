"use client";

import { useState, Suspense, useMemo } from "react";
import { ArrowUpRight, MapPin } from "lucide-react";
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
  useEventSettings,
  type EventData,
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

  const [ticketQuantities, setTicketQuantities] = useState<
    Record<string, number>
  >({
    "early-birds": 1,
    kids: 0,
    general: 0,
  });
  const [expandedTicket, setExpandedTicket] = useState<string | null>(
    "early-birds"
  );
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Compute displayed tickets based on settings
  const displayedTickets = useMemo(() => {
    return eventData.tickets.slice(0, settings.ticketCount);
  }, [eventData.tickets, settings.ticketCount]);

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
        <main className="w-full max-w-[1062px] flex flex-col lg:flex-row gap-8 px-0 md:px-8 lg:px-6 md:pt-5 pb-24 lg:pb-20">
          {/* Desktop: Two column layout */}
          {/* Left Column - hidden on mobile, shown on desktop */}
          <div className="hidden lg:flex flex-1 flex-col gap-4">
            <EventBannerCarousel
              eventName={eventData.name}
              imageCount={settings.imageCount}
            />
            <div className="flex flex-col gap-4">
              <OrganizerSection organizer={eventData.organizer} />
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
            <EventHeader event={eventData} locationTBD={settings.locationTBD} />

            <div className="flex flex-col gap-3">
              {displayedTickets.map((ticket) => (
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
              />
              {settings.showSpotify && (
                <SpotifySection playlist={eventData.playlist} />
              )}

              <div className="flex flex-col gap-3">
                {displayedTickets.map((ticket) => (
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

              {settings.showAddons && (
                <div className="flex flex-col w-full pb-4 border-b border-light-gray dark:border-[#2a2a35]">
                  <AddonsSection />
                </div>
              )}

              <OrganizerSection organizer={eventData.organizer} />

              {displayedDescription && (
                <AboutSection
                  description={displayedDescription}
                  showFull={showFullDescription}
                  onToggle={() => setShowFullDescription(!showFullDescription)}
                />
              )}
              {!settings.locationTBD && <MapSection venue={eventData.venue} />}
              {settings.showLineup && (
                <LineupSection lineup={eventData.lineup} />
              )}
            </div>
          </div>
        </main>

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

function EventHeader({
  event,
  locationTBD,
}: {
  event: EventData;
  locationTBD: boolean;
}) {
  return (
    <div className="border-b border-light-gray dark:border-[#2a2a35] pb-4 flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h1 className="font-black text-[30px] text-black dark:text-white leading-tight">
          {event.name}
        </h1>
        <p className="text-sm text-dark-gray dark:text-[#9ca3af]">
          {event.date} @ {event.time}
        </p>
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
