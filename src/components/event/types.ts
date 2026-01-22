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
}

export interface Artist {
  id: string;
  name: string;
  hasImage: boolean;
}

export interface Playlist {
  trackName: string;
  artist: string;
}

export interface EventData {
  name: string;
  date: string;
  time: string;
  venue: Venue;
  organizer: Organizer;
  tickets: Ticket[];
  lineup: Artist[];
  description: string;
  playlist: Playlist;
}
