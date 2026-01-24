import type { ReactNode } from "react";
import type { EventData, Ticket } from "../types";
import type { EventControlsSettings } from "../use-event-controls";

export interface TicketState {
  quantities: Record<string, number>;
  expandedTicket: string | null;
  displayedTickets: Ticket[];
  ticketsByDay: Record<string, Ticket[]> | null;
  ticketDayTab: "all" | "single";
  totalTickets: number;
  totalPrice: number;
  isMultiDay: boolean;
  onQuantityChange: (ticketId: string, delta: number) => void;
  onExpandToggle: (ticketId: string) => void;
  onTabChange: (tab: "all" | "single") => void;
}

export interface DescriptionState {
  displayedDescription: string | null;
  showFullDescription: boolean;
  onToggleDescription: () => void;
}

export interface LayoutSections {
  bannerDesktop: ReactNode;
  bannerMobile: ReactNode;
  bannerCarouselDesktop: ReactNode;
  bannerCarouselMobile: ReactNode;
  bannerGridDesktop: ReactNode;
  bannerGridMobile: ReactNode;
  organizer: ReactNode;
  spotify: ReactNode | null;
  lineup: ReactNode | null;
  about: ReactNode | null;
  map: ReactNode | null;
  addons: ReactNode | null;
  sponsors: ReactNode | null;
  hostPromo: ReactNode;
}

export interface LayoutProps {
  eventData: EventData;
  settings: EventControlsSettings;
  ticketState: TicketState;
  descriptionState: DescriptionState;
  sections: LayoutSections;
  header: ReactNode;
  ticketsList: ReactNode;
  checkoutButton: ReactNode;
}
