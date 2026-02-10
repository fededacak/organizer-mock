"use client";

import { TicketCard } from "./ticket-card";
import { SeatedTicketCard } from "./seated-ticket-card";
import { PayWhatYouWantTicketCard } from "./pay-what-you-want-ticket-card";
import { FreeTicketCard } from "./free-ticket-card";
import type { Ticket } from "./types";

interface TicketsListProps {
  tickets: Ticket[];
  ticketsByDay: Record<string, Ticket[]> | null;
  quantities: Record<string, number>;
  expandedTicket: string | null;
  isMultiDay: boolean;
  ticketDayTab: "all" | "single";
  selectedSeatedTicketId: string | null;
  customPrices: Record<string, string>;
  onQuantityChange: (ticketId: string, delta: number) => void;
  onExpandToggle: (ticketId: string) => void;
  onTabChange: (tab: "all" | "single") => void;
  onSeatedTicketSelect: (ticketId: string) => void;
  onCustomPriceChange: (ticketId: string, price: string) => void;
}

export function TicketsList({
  tickets,
  ticketsByDay,
  quantities,
  expandedTicket,
  isMultiDay,
  ticketDayTab,
  selectedSeatedTicketId,
  customPrices,
  onQuantityChange,
  onExpandToggle,
  onTabChange,
  onSeatedTicketSelect,
  onCustomPriceChange,
}: TicketsListProps) {
  const renderTicket = (ticket: Ticket) => {
    if (ticket.isSeated) {
      return (
        <SeatedTicketCard
          key={ticket.id}
          ticket={ticket}
          isSelected={selectedSeatedTicketId === ticket.id}
          onSelect={() => onSeatedTicketSelect(ticket.id)}
        />
      );
    }
    if (ticket.isFree) {
      return (
        <FreeTicketCard
          key={ticket.id}
          ticket={ticket}
          quantity={quantities[ticket.id] || 0}
          isExpanded={expandedTicket === ticket.id}
          onToggleExpand={() => onExpandToggle(ticket.id)}
          onUpdateQuantity={(delta) => onQuantityChange(ticket.id, delta)}
        />
      );
    }
    if (ticket.isPayWhatYouWant) {
      return (
        <PayWhatYouWantTicketCard
          key={ticket.id}
          ticket={ticket}
          quantity={quantities[ticket.id] || 0}
          onUpdateQuantity={(delta) => onQuantityChange(ticket.id, delta)}
          customPrice={customPrices[ticket.id] || ""}
          onPriceChange={(price) => onCustomPriceChange(ticket.id, price)}
        />
      );
    }
    return (
      <TicketCard
        key={ticket.id}
        ticket={ticket}
        quantity={quantities[ticket.id] || 0}
        isExpanded={expandedTicket === ticket.id}
        onToggleExpand={() => onExpandToggle(ticket.id)}
        onUpdateQuantity={(delta) => onQuantityChange(ticket.id, delta)}
      />
    );
  };

  return (
    <div className="flex flex-col gap-3">
      {isMultiDay && (
        <TicketDayTabs activeTab={ticketDayTab} onTabChange={onTabChange} />
      )}
      {ticketsByDay
        ? Object.entries(ticketsByDay).map(([day, dayTickets]) => (
            <div key={day} className="flex flex-col gap-2.5">
              <p className="font-extrabold text-sm text-black dark:text-white">
                {day}
              </p>
              {dayTickets.map(renderTicket)}
            </div>
          ))
        : tickets.map(renderTicket)}
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
    <div className="flex bg-light-gray dark:bg-[#1e1e26] p-1.5 rounded-[20px] shadow-[0px_4px_24px_0px_rgba(155,182,190,0.07)]">
      <button
        onClick={() => onTabChange("all")}
        className={`flex-1 px-4 py-2 text-sm font-bold rounded-[14px] transition-colors duration-200 ease-out cursor-pointer ${
          activeTab === "all"
            ? "text-white"
            : "text-dark-gray dark:text-[#9ca3af] hover:text-black dark:hover:text-white"
        }`}
        style={
          activeTab === "all"
            ? { backgroundColor: "var(--color-tp-blue)" }
            : undefined
        }
      >
        All Days
      </button>
      <button
        onClick={() => onTabChange("single")}
        className={`flex-1 px-4 py-2 text-sm font-semibold rounded-[14px] transition-colors duration-200 ease-out cursor-pointer ${
          activeTab === "single"
            ? "text-white"
            : "text-dark-gray dark:text-[#9ca3af] hover:text-black dark:hover:text-white"
        }`}
        style={
          activeTab === "single"
            ? { backgroundColor: "var(--color-tp-blue)" }
            : undefined
        }
      >
        Single Day
      </button>
    </div>
  );
}
