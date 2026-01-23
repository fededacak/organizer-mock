"use client";

import { TicketCard } from "./ticket-card";
import type { Ticket } from "./types";

interface TicketsListProps {
  tickets: Ticket[];
  ticketsByDay: Record<string, Ticket[]> | null;
  quantities: Record<string, number>;
  expandedTicket: string | null;
  isMultiDay: boolean;
  ticketDayTab: "all" | "single";
  onQuantityChange: (ticketId: string, delta: number) => void;
  onExpandToggle: (ticketId: string) => void;
  onTabChange: (tab: "all" | "single") => void;
}

export function TicketsList({
  tickets,
  ticketsByDay,
  quantities,
  expandedTicket,
  isMultiDay,
  ticketDayTab,
  onQuantityChange,
  onExpandToggle,
  onTabChange,
}: TicketsListProps) {
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
              {dayTickets.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  quantity={quantities[ticket.id] || 0}
                  isExpanded={expandedTicket === ticket.id}
                  onToggleExpand={() => onExpandToggle(ticket.id)}
                  onUpdateQuantity={(delta) => onQuantityChange(ticket.id, delta)}
                />
              ))}
            </div>
          ))
        : tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              quantity={quantities[ticket.id] || 0}
              isExpanded={expandedTicket === ticket.id}
              onToggleExpand={() => onExpandToggle(ticket.id)}
              onUpdateQuantity={(delta) => onQuantityChange(ticket.id, delta)}
            />
          ))}
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
            ? "bg-primary text-white"
            : "text-dark-gray dark:text-[#9ca3af] hover:text-black dark:hover:text-white"
        }`}
      >
        All Days
      </button>
      <button
        onClick={() => onTabChange("single")}
        className={`flex-1 px-4 py-2 text-sm font-semibold rounded-[14px] transition-colors duration-200 ease-out cursor-pointer ${
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
