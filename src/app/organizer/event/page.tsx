import type { Metadata } from "next";
import type { EventData } from "@/components/event";
import { EventPageClient } from "./event-page-client";

// Mock data - in production this would come from an API/database
const EVENT_DATA: EventData = {
  name: "Summit Sound Sessions",
  date: "2026-02-22",
  endDate: "2026-02-24",
  time: "18:00",
  endTime: "19:30",
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
    {
      id: "vip",
      name: "VIP Experience",
      price: 75,
      description:
        "Premium VIP access with exclusive backstage meet & greet, complimentary drinks, and reserved seating.",
    },
    {
      id: "group",
      name: "Group Pass (4 people)",
      price: 65,
      description:
        "Discounted admission for groups of 4. All attendees must enter together.",
    },
    {
      id: "late-night",
      name: "Late Night Entry",
      price: 8,
      description:
        "Entry after 10pm only. Perfect for those who want to catch the final acts.",
    },
  ],
  singleDayTickets: [
    {
      id: "saturday",
      name: "General Admission - Saturday",
      price: 15,
      description: "Admission for Saturday only.",
      day: "Saturday",
    },
    {
      id: "sunday",
      name: "General Admission - Sunday",
      price: 15,
      description: "Admission for Sunday only.",
      day: "Sunday",
    },
  ],
  lineup: [
    {
      id: "1",
      name: "Shakira",
      hasImage: false,
      description:
        "Shakira is a Colombian singer-songwriter and dancer who has captivated audiences worldwide with her unique blend of Latin, rock, and pop music. Known for her powerful vocals and electrifying stage presence, she has sold over 80 million records and won multiple Grammy Awards throughout her illustrious career.",
      spotifyTrack: {
        trackName: "Hips Don't Lie",
        artist: "Shakira ft. Wyclef Jean",
      },
      youtubeVideoId: "DUT5rXLdlW0",
      instagramHandle: "shakira",
      tiktokHandle: "shakira",
    },
    {
      id: "2",
      name: "Eminem",
      hasImage: true,
      description:
        "Eminem is an American rapper, songwriter, and record producer widely regarded as one of the greatest hip-hop artists of all time. With his rapid-fire delivery and provocative lyrics, he has pushed the boundaries of the genre while selling over 220 million records worldwide and earning 15 Grammy Awards.",
      spotifyTrack: {
        trackName: "Lose Yourself",
        artist: "Eminem",
      },
      youtubeVideoId: "_Yhyp-_hX2s",
      instagramHandle: "eminem",
      tiktokHandle: "eminem",
    },
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
