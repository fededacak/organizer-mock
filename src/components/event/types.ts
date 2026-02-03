export interface Organizer {
  name: string;
  avatar: string;
  eventsOrganized: number;
  attendeesHosted: string;
}

export interface Venue {
  name: string;
  address: string;
}

export interface Ticket {
  id: string;
  name: string;
  price: number;
  description?: string;
  day?: string;
  isSeated?: boolean;
}

export interface Artist {
  id: string;
  name: string;
  hasImage: boolean;
  description?: string;
  spotifyTrack?: Playlist;
  youtubeVideoId?: string;
  instagramHandle?: string;
  tiktokHandle?: string;
}

export interface Playlist {
  trackName: string;
  artist: string;
}

export interface EventData {
  name: string;
  /** ISO date string (e.g., "2026-02-22") */
  date: string;
  /** ISO date string for multiday events (e.g., "2026-02-24") */
  endDate?: string;
  /** Time in 24h format (e.g., "18:00") */
  time: string;
  /** End time in 24h format (e.g., "19:30") */
  endTime?: string;
  venue: Venue;
  organizer: Organizer;
  tickets: Ticket[];
  singleDayTickets?: Ticket[];
  lineup: Artist[];
  description: string;
  playlist: Playlist;
}
