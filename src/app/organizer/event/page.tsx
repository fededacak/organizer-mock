import type { Metadata } from "next";
import type { EventData } from "@/components/event";
import { EventPageClient } from "./event-page-client";

// Mock data - in production this would come from an API/database
const EVENT_DATA: EventData = {
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

export const metadata: Metadata = {
  title: `${EVENT_DATA.name} | TickPick`,
  description: EVENT_DATA.description.slice(0, 160),
};

export default function EventPage() {
  return <EventPageClient eventData={EVENT_DATA} />;
}
