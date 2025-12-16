"use client";

import { TickPickLogo } from "@/components/tickpick-logo";
import { Button } from "@/components/ui/button";
import { EventBannerCarousel } from "@/components/event-banner-carousel";
import { useState } from "react";
import {
  MapPin,
  Minus,
  Plus,
  Play,
  Share2,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
} from "lucide-react";
import Image from "next/image";

// Mock data from Figma
const EVENT_DATA = {
  name: "Summit Sound Sessions",
  date: "Dec 12, 2025",
  time: "8:00pm",
  venue: {
    name: "Lakeside Pavilion",
    address: "1233 Rose Ave, Venice, CA",
  },
  organizer: {
    name: "NextWave Events",
    avatar: "/organizer-avatar.jpg",
    eventsOrganized: 14,
    attendeesHosted: "3.5k",
  },
  tickets: [
    {
      id: "early-birds",
      name: "Early Birds",
      price: 10.5,
      description:
        "Each VIP ticket includes admission to Catch One for Dirty Fest on Nov 16th, 2024 plus the following: - VIP badge - Skip the line - Better view area - Private Artist Bar with premium Bartending Service.",
    },
    {
      id: "kids",
      name: "General Admission - Kids (5 to 12 yrs)",
      price: 5,
      description: "Admission for children aged 5 to 12 years old.",
    },
    {
      id: "general",
      name: "General Admission",
      price: 20.5,
      description: "Standard admission ticket for the event.",
    },
  ],
  lineup: [
    { id: "1", name: "Shakira", hasImage: false },
    { id: "2", name: "Eminem", hasImage: true },
  ],
  description: `Lyric Night is a space for artists and creatives alike to come together and work on their writing skills. It's a space where we practice writing exercises, share our work and meet other artists and creatives.

No writing experience is necessary to come.

See you February 7th. Lyric Night is a space for artists and creatives alike to come together and work on their writing skills. It's a space where we practice writing exercises, share our work and meet other artists and creatives. Lyric Night is a space for artists and creatives alike to come together and work on their writing skills. It's a space where we practice writing exercises, share our work and meet other artists and creatives.`,
  playlist: {
    trackName: "Ice Cream (Featuring Matias Aguayo)",
    artist: "Battles",
  },
};

export default function EventPage() {
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
  const totalPrice = EVENT_DATA.tickets.reduce((sum, ticket) => {
    return sum + ticket.price * (ticketQuantities[ticket.id] || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="w-full max-w-[1014px] flex flex-col lg:flex-row gap-8 px-4 lg:px-0 pt-5 pb-20">
        {/* Left Column */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Event Image Carousel */}
          <EventBannerCarousel eventName={EVENT_DATA.name} />

          {/* Organized By Section */}
          <OrganizerSection organizer={EVENT_DATA.organizer} />

          {/* Spotify Section */}
          <SpotifySection playlist={EVENT_DATA.playlist} />

          {/* Lineup Section */}
          <LineupSection lineup={EVENT_DATA.lineup} />

          {/* Host Event Promo */}
          <HostEventPromo />
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-[500px] flex flex-col gap-4">
          {/* Event Name & Details */}
          <div className="border-b border-light-gray pb-4">
            <h1 className="font-black text-[30px] text-black leading-tight">
              {EVENT_DATA.name}
            </h1>
            <p className="text-sm text-dark-gray mt-1">
              {EVENT_DATA.date} @ {EVENT_DATA.time}
            </p>
            <div className="mt-2">
              <p className="font-extrabold text-sm text-black">
                {EVENT_DATA.venue.name}
              </p>
              <p className="text-sm text-black">{EVENT_DATA.venue.address}</p>
            </div>
          </div>

          {/* Tickets Section */}
          <div className="border-b border-light-gray pb-4 flex flex-col gap-3">
            {EVENT_DATA.tickets.map((ticket) => (
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

          {/* Checkout Button */}
          <CheckoutButton totalTickets={totalTickets} totalPrice={totalPrice} />

          {/* About Section */}
          <AboutSection
            description={EVENT_DATA.description}
            showFull={showFullDescription}
            onToggle={() => setShowFullDescription(!showFullDescription)}
          />

          {/* Map Section */}
          <MapSection venue={EVENT_DATA.venue} />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

// Navbar Component
function Navbar() {
  return (
    <header className="w-full bg-white">
      <div className="max-w-[1456px] mx-auto h-[86px] flex items-center justify-between px-4 lg:px-[72px]">
        <TickPickLogo width={145} height={32} />
        <div className="flex items-center gap-5">
          <button className="font-semibold text-sm text-dark-gray hover:text-black transition-colors duration-200 ease hidden sm:block cursor-pointer">
            Organize Events
          </button>
          <button className="font-semibold text-sm text-dark-gray hover:text-black transition-colors duration-200 ease hidden sm:block cursor-pointer">
            Sell Tickets
          </button>
          <div className="hidden sm:block w-px h-[38px] bg-light-gray mx-2" />
          <Button className="bg-tp-blue hover:bg-tp-blue/90 text-white font-bold text-base rounded-[36px] px-4 py-2 h-auto">
            Log In
          </Button>
        </div>
      </div>
    </header>
  );
}

// Organizer Section Component
function OrganizerSection({
  organizer,
}: {
  organizer: typeof EVENT_DATA.organizer;
}) {
  return (
    <section className="border-b border-light-gray pb-4">
      <SectionHeader title="Organized By" />
      <div className="bg-light-gray rounded-[20px] p-5 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-mid-gray overflow-hidden shrink-0">
          <Image
            src={organizer.avatar}
            alt={organizer.name}
            width={64}
            height={64}
            className="object-cover"
          />
        </div>
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <p className="font-extrabold text-base text-black">
              {organizer.name}
            </p>
            <p className="text-xs text-dark-gray">
              <span className="font-bold">{organizer.eventsOrganized}</span>{" "}
              events organized
            </p>
            <p className="text-xs text-dark-gray">
              <span className="font-bold">{organizer.attendeesHosted}</span>{" "}
              attendees hosted
            </p>
          </div>
          <Button className="bg-black hover:bg-black/90 text-white font-bold text-sm rounded-[36px] px-4 py-2 h-auto">
            Follow
          </Button>
        </div>
      </div>
    </section>
  );
}

// Spotify Section Component
function SpotifySection({
  playlist,
}: {
  playlist: typeof EVENT_DATA.playlist;
}) {
  return (
    <section className="border-b border-light-gray pb-4">
      <SectionHeader title="Playlist" />
      <div
        className="rounded-2xl overflow-hidden h-20"
        style={{
          background:
            "linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.8) 100%), linear-gradient(90deg, rgb(175, 94, 114) 0%, rgb(175, 94, 114) 100%)",
        }}
      >
        <div className="flex h-full">
          {/* Album Art */}
          <div className="relative w-20 h-20 bg-gray shrink-0">
            <Image
              src="/album-cover.jpg"
              alt="Album cover"
              width={80}
              height={80}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-black/30 flex items-center justify-center">
                <Play className="w-5 h-5 text-white fill-white" />
              </div>
            </div>
          </div>
          {/* Track Info */}
          <div className="flex-1 p-2 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-white truncate drop-shadow-sm">
                  {playlist.trackName}
                </p>
                <p className="text-sm text-white truncate drop-shadow-sm">
                  {playlist.artist}
                </p>
              </div>
              {/* Spotify icon placeholder */}
              <div className="w-[18px] h-[18px] rounded-full bg-[#1DB954] flex items-center justify-center shrink-0">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
              </div>
            </div>
            {/* Progress bar and share */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1 bg-white/30 rounded-full">
                <div className="w-0 h-full bg-white rounded-full" />
              </div>
              <Share2 className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Lineup Section Component
function LineupSection({ lineup }: { lineup: typeof EVENT_DATA.lineup }) {
  return (
    <section>
      <SectionHeader title="Lineup" />
      <div className="flex flex-col gap-4">
        {lineup.map((artist) => (
          <div
            key={artist.id}
            className="bg-white border border-light-gray rounded-[20px] p-3 shadow-[0px_0px_5px_0px_rgba(0,0,0,0.08)] flex items-center gap-3"
          >
            {artist.hasImage ? (
              <div className="w-[30px] h-[30px] rounded-[11px] bg-mid-gray overflow-hidden">
                <Image
                  src="/lineup-avatar.jpg"
                  alt={artist.name}
                  width={30}
                  height={30}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-[30px] h-[30px] rounded-[11px] bg-tp-orange flex items-center justify-center">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="white"
                  className="opacity-90"
                >
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
              </div>
            )}
            <p className="font-bold text-sm text-black">{artist.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// Ticket Card Component
function TicketCard({
  ticket,
  quantity,
  isExpanded,
  onToggleExpand,
  onUpdateQuantity,
}: {
  ticket: (typeof EVENT_DATA.tickets)[0];
  quantity: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdateQuantity: (delta: number) => void;
}) {
  const isSelected = quantity > 0;
  const formatPrice = (price: number) =>
    `$${price.toFixed(2).replace(/\.00$/, "")}`;

  return (
    <div
      className={`rounded-[20px] p-4 transition-shadow duration-200 ease ${
        isSelected
          ? "shadow-[inset_0_0_0_1.5px_var(--color-tp-blue)]"
          : "shadow-[inset_0_0_0_1px_var(--color-neutral-200)]"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p className="font-bold text-sm text-black">{ticket.name}</p>
          <p className="font-black text-xl text-black mt-1.5">
            {formatPrice(ticket.price)}
          </p>
        </div>
        {/* Quantity Stepper or Add Button */}
        {isSelected ? (
          <div className="bg-light-gray rounded-[35px] h-[30px] flex items-center justify-center gap-2 px-2 py-1 shrink-0">
            <button
              onClick={() => onUpdateQuantity(-1)}
              className="size-[14px] cursor-pointer flex items-center justify-center text-dark-gray hover:text-black transition-colors duration-200 ease shrink-0"
            >
              <Minus className="size-[14px]" strokeWidth={3} />
            </button>
            <div className="w-[22px] h-full bg-white rounded-[6px] flex items-center justify-center shrink-0">
              <span className="font-extrabold text-sm text-black leading-none">
                {quantity}
              </span>
            </div>
            <button
              onClick={() => onUpdateQuantity(1)}
              className="size-[14px] cursor-pointer flex items-center justify-center text-dark-gray hover:text-black transition-colors duration-200 ease shrink-0"
            >
              <Plus className="size-[14px]" strokeWidth={3} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => onUpdateQuantity(1)}
            className="w-[30px] h-[30px] cursor-pointer rounded-full bg-light-gray flex items-center justify-center hover:bg-soft-gray transition-colors duration-200 ease"
          >
            <Plus className="size-[14px] text-dark-gray" strokeWidth={3} />
          </button>
        )}
      </div>

      {/* Expanded Description */}
      {isSelected && isExpanded && (
        <div className="mt-2.5">
          <p className="text-sm text-dark-gray leading-relaxed line-clamp-2">
            {ticket.description}
          </p>
          <button
            onClick={onToggleExpand}
            className="font-bold text-[10px] text-tp-blue uppercase mt-1.5 hover:underline cursor-pointer"
          >
            show more
          </button>
        </div>
      )}
    </div>
  );
}

// Checkout Button Component
function CheckoutButton({
  totalTickets,
  totalPrice,
}: {
  totalTickets: number;
  totalPrice: number;
}) {
  const formatPrice = (price: number) =>
    `$${price.toFixed(2).replace(/\.00$/, "")}`;

  return (
    <button className="w-full bg-tp-blue rounded-[36px] p-[9px] flex items-center justify-between text-white cursor-pointer hover:bg-tp-blue/90 transition-colors duration-200 ease">
      <div
        className={`w-[26px] h-[26px] rounded-full bg-black/10 flex items-center justify-center ${
          totalTickets === 0 ? "opacity-0" : ""
        }`}
      >
        <span className="font-bold text-sm tracking-tight">{totalTickets}</span>
      </div>
      <span className="font-bold text-base tracking-tight">
        Buy Tickets - {formatPrice(totalPrice)}
      </span>
      <div className="w-[26px] h-[26px] opacity-0" />
    </button>
  );
}

// About Section Component
function AboutSection({
  description,
  showFull,
  onToggle,
}: {
  description: string;
  showFull: boolean;
  onToggle: () => void;
}) {
  return (
    <section className="flex flex-col gap-3">
      <div>
        <SectionHeader title="About" />
        <div className="text-sm text-black leading-relaxed">
          {showFull ? (
            <p className="whitespace-pre-line">{description}</p>
          ) : (
            <p className="line-clamp-6 whitespace-pre-line">{description}</p>
          )}
        </div>
      </div>
      <button
        onClick={onToggle}
        className="self-start border cursor-pointer border-neutral-200 rounded-[30px] px-3 py-1.5 flex items-center gap-1 hover:border-mid-gray transition-colors duration-200 ease"
      >
        <span className="font-bold text-[9px] text-black uppercase tracking-tight">
          {showFull ? "show less" : "show more"}
        </span>
        {showFull ? (
          <ChevronUp className="w-3 h-3 text-black" />
        ) : (
          <ChevronDown className="w-3 h-3 text-black" />
        )}
      </button>
    </section>
  );
}

// Map Section Component
function MapSection({ venue }: { venue: typeof EVENT_DATA.venue }) {
  return (
    <section className="pb-4">
      <p className="font-extrabold text-sm text-black">{venue.name}</p>
      <div className="flex items-center gap-2.5 mt-2.5">
        <div className="w-[22px] h-[22px] rounded-full bg-tp-orange flex items-center justify-center">
          <MapPin className="w-3 h-3 text-white" strokeWidth={2.5} />
        </div>
        <p className="text-sm text-black">{venue.address}</p>
      </div>
      {/* Static Map Placeholder */}
      <div className="mt-2.5 w-full h-36 rounded-2xl bg-light-gray overflow-hidden relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-tp-blue flex items-center justify-center shadow-lg">
            <MapPin className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
        </div>
        {/* Map pattern background */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
            linear-gradient(90deg, #d1d1d1 1px, transparent 1px),
            linear-gradient(#d1d1d1 1px, transparent 1px)
          `,
            backgroundSize: "20px 20px",
          }}
        />
      </div>
    </section>
  );
}

// Section Header Component
function SectionHeader({ title }: { title: string }) {
  return <p className="font-extrabold text-sm text-black mb-2.5">{title}</p>;
}

// Host Event Promo Component
function HostEventPromo() {
  return (
    <section className="border-t border-light-gray pt-4">
      <a
        href="#"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 group"
      >
        <span className="font-semibold text-sm text-shimmer">
          Host your event with TickPick
        </span>
        <ArrowUpRight className="w-4 h-4 text-border group-hover:text-accent motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5 transition-all duration-200 ease-out" />
      </a>
    </section>
  );
}

// Footer Component
function Footer() {
  const companyLinks = [
    "About Us",
    "Partners",
    "Press",
    "Mobile Apps",
    "Organize Events",
    "Sell Tickets",
    "Gift Cards",
    "Contact Us",
    "Careers",
    "Blog",
    "Ticket Brokers",
    "Seating Charts",
    "Refer Friends",
    "Affiliates",
    "Broker Licenses",
  ];

  const promiseLinks = [
    "BuyerTrust Guarantee",
    "BestPrice Guarantee",
    "User Agreement",
    "Privacy Policy",
    "Cookie Policy",
    "Do Not Sell or Share My Personal Information",
    "CCPA Notice",
    "FAQ",
    "Accessibility",
  ];

  return (
    <footer className="w-full bg-white border-t border-light-gray">
      {/* Host Event Promo - Full Width Dark */}
      <div className="w-full bg-black py-3 mb-5">
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 group"
        >
          <span className="font-semibold text-sm bg-linear-to-r from-tp-blue to-white bg-clip-text text-transparent">
            Host your event with TickPick
          </span>
          <ArrowUpRight className="w-4 h-4 text-white group-hover:text-white motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5 transition-all duration-200 ease-out" />
        </a>
      </div>

      <div className="max-w-[1000px] mx-auto px-4">
        {/* Main Links */}
        <div className="flex flex-wrap justify-between gap-8 py-6">
          {/* Logo */}
          <div className="w-[190px]">
            <TickPickLogo width={190} height={42} />
          </div>

          {/* App Downloads */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex flex-col gap-3">
              {/* App Store */}
              <div className="w-[152px] h-[51px] bg-black rounded-md flex items-center px-2 gap-2">
                <svg
                  width="22"
                  height="27"
                  viewBox="0 0 22 27"
                  fill="white"
                  className="shrink-0"
                >
                  <path d="M18.5 13.5c0-3.5 2.8-5.2 2.9-5.3-1.6-2.3-4.1-2.6-5-2.7-2.1-.2-4.1 1.2-5.2 1.2-1.1 0-2.7-1.2-4.5-1.2-2.3 0-4.4 1.3-5.6 3.4-2.4 4.2-.6 10.3 1.7 13.7 1.1 1.7 2.5 3.5 4.3 3.4 1.7-.1 2.4-1.1 4.4-1.1 2.1 0 2.7 1.1 4.5 1.1 1.9 0 3-1.7 4.1-3.4 1.3-1.9 1.8-3.7 1.9-3.8-.1 0-3.5-1.4-3.5-5.3zM15.2 3.5c.9-1.1 1.6-2.7 1.4-4.2-1.4.1-3 .9-4 2-.9 1-1.6 2.5-1.4 4 1.5.1 3-.8 4-1.8z" />
                </svg>
                <div className="flex flex-col text-white">
                  <span className="text-[10px] leading-tight">
                    Download on the
                  </span>
                  <span className="text-lg font-medium leading-tight tracking-tight">
                    App Store
                  </span>
                </div>
              </div>
              {/* Google Play */}
              <div className="w-[152px] h-[51px] bg-black rounded-md flex items-center px-2 gap-2">
                <svg
                  width="24"
                  height="27"
                  viewBox="0 0 24 27"
                  fill="none"
                  className="shrink-0"
                >
                  <path
                    d="M1 1.5L14 13.5L1 25.5V1.5Z"
                    fill="#00D9FF"
                    stroke="#00D9FF"
                    strokeWidth="0.5"
                  />
                  <path
                    d="M14 13.5L18 10L5 2L14 13.5Z"
                    fill="#00FF85"
                    stroke="#00FF85"
                    strokeWidth="0.5"
                  />
                  <path
                    d="M14 13.5L18 17L5 25L14 13.5Z"
                    fill="#FF3B3B"
                    stroke="#FF3B3B"
                    strokeWidth="0.5"
                  />
                  <path
                    d="M18 10L22 12.5L18 17L14 13.5L18 10Z"
                    fill="#FFCF00"
                    stroke="#FFCF00"
                    strokeWidth="0.5"
                  />
                </svg>
                <div className="flex flex-col text-white">
                  <span className="text-[11px] uppercase leading-tight">
                    Get it on
                  </span>
                  <span className="text-lg font-medium leading-tight">
                    Google Play
                  </span>
                </div>
              </div>
            </div>
            {/* Rating */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg
                    key={i}
                    width="12"
                    height="14"
                    viewBox="0 0 12 14"
                    fill="#FFB222"
                  >
                    <path d="M6 0L7.76 4.56L12 5.28L8.8 8.64L9.52 13.2L6 11.04L2.48 13.2L3.2 8.64L0 5.28L4.24 4.56L6 0Z" />
                  </svg>
                ))}
              </div>
              <span className="text-[11px] text-dark-gray">
                Rating: 4.8 - 168k reviews
              </span>
            </div>
          </div>

          {/* Company Links */}
          <div className="flex flex-col gap-2">
            <p className="font-extrabold text-[15px] text-black">Company</p>
            <div className="flex flex-col gap-1">
              {companyLinks.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-sm text-neutral-700 hover:text-black transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Promise Links */}
          <div className="flex flex-col gap-2 w-[194px]">
            <p className="font-extrabold text-[15px] text-black">Our Promise</p>
            <div className="flex flex-col gap-1">
              {promiseLinks.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-sm text-neutral-700 hover:text-black transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-light-gray py-5 flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm text-dark-gray">
            <p>©2025 TickPick LLC. All rights reserved.</p>
            <p>
              This site is protected by reCAPTCHA and the Google{" "}
              <a href="#" className="text-tp-blue hover:underline">
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href="#" className="text-tp-blue hover:underline">
                Terms of Service
              </a>{" "}
              apply
            </p>
          </div>
          {/* Social Icons */}
          <div className="flex items-center gap-3">
            {/* Instagram */}
            <a
              href="#"
              className="w-[30px] h-[30px] rounded-lg bg-linear-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            {/* YouTube */}
            <a
              href="#"
              className="w-[30px] h-[30px] rounded-lg bg-red-600 flex items-center justify-center"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
            </a>
            {/* Facebook */}
            <a
              href="#"
              className="w-[30px] h-[30px] rounded-full bg-blue-600 flex items-center justify-center"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
            </a>
            {/* X (Twitter) */}
            <a
              href="#"
              className="w-[30px] h-[30px] rounded-full bg-black flex items-center justify-center"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
