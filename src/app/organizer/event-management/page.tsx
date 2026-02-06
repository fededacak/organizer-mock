import { EventOverviewClient } from "./event-overview-client";

// ── Types ────────────────────────────────────────────────────────────────────

export interface TicketSalesData {
  id: string;
  name: string;
  price: number;
  sold: number;
  total: number;
}

export interface RecentOrder {
  id: string;
  buyerName: string;
  ticketType: string;
  quantity: number;
  amount: number;
  timeAgo: string;
  status: "confirmed" | "pending" | "refunded";
}

export interface SetupTask {
  id: string;
  label: string;
  completed: boolean;
  href: string;
}

export interface DailySales {
  day: string;
  tickets: number;
  revenue: number;
}

export interface EventOverviewData {
  event: {
    name: string;
    date: string;
    time: string;
    venue: string;
    address: string;
  };
  stats: {
    totalRevenue: number;
    revenueChange: number;
    ticketsSold: number;
    ticketsTotal: number;
    pageViews: number;
    viewsChange: number;
    conversionRate: number;
  };
  tickets: TicketSalesData[];
  recentOrders: RecentOrder[];
  setupTasks: SetupTask[];
  dailySales: DailySales[];
}

// ── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_DATA: EventOverviewData = {
  event: {
    name: "Illuminate Nights",
    date: "2026-04-12",
    time: "19:00",
    venue: "Lakeside Pavilion",
    address: "1233 Rose Ave, Venice, CA",
  },
  stats: {
    totalRevenue: 4280,
    revenueChange: 12.5,
    ticketsSold: 142,
    ticketsTotal: 500,
    pageViews: 1234,
    viewsChange: 8.3,
    conversionRate: 11.5,
  },
  tickets: [
    { id: "early-birds", name: "Early Birds", price: 10.5, sold: 50, total: 50 },
    { id: "general", name: "General Admission", price: 20.5, sold: 45, total: 200 },
    { id: "vip", name: "VIP Experience", price: 75, sold: 28, total: 50 },
    { id: "kids", name: "Kids", price: 5, sold: 12, total: 100 },
    { id: "group", name: "Group Pass (4 people)", price: 65, sold: 5, total: 50 },
    { id: "late-night", name: "Late Night Entry", price: 8, sold: 2, total: 50 },
  ],
  recentOrders: [
    {
      id: "ord-1",
      buyerName: "Sarah M.",
      ticketType: "VIP Experience",
      quantity: 2,
      amount: 150,
      timeAgo: "2 min ago",
      status: "confirmed",
    },
    {
      id: "ord-2",
      buyerName: "James K.",
      ticketType: "General Admission",
      quantity: 4,
      amount: 82,
      timeAgo: "18 min ago",
      status: "confirmed",
    },
    {
      id: "ord-3",
      buyerName: "Maria L.",
      ticketType: "Early Birds",
      quantity: 1,
      amount: 10.5,
      timeAgo: "1 hour ago",
      status: "confirmed",
    },
    {
      id: "ord-4",
      buyerName: "David R.",
      ticketType: "Group Pass",
      quantity: 1,
      amount: 65,
      timeAgo: "3 hours ago",
      status: "confirmed",
    },
    {
      id: "ord-5",
      buyerName: "Emily C.",
      ticketType: "General Admission",
      quantity: 2,
      amount: 41,
      timeAgo: "5 hours ago",
      status: "pending",
    },
  ],
  setupTasks: [
    {
      id: "description",
      label: "Add event description",
      completed: true,
      href: "/organizer/event-management/edit",
    },
    {
      id: "banner",
      label: "Upload banner image",
      completed: true,
      href: "/organizer/event-management/edit",
    },
    {
      id: "tickets",
      label: "Set up tickets",
      completed: true,
      href: "/organizer/event-management/tickets",
    },
    {
      id: "checkout",
      label: "Configure checkout",
      completed: false,
      href: "/organizer/event-management/checkout",
    },
    {
      id: "integrations",
      label: "Add integrations",
      completed: false,
      href: "/organizer/event-management/integrations",
    },
    {
      id: "publish",
      label: "Publish event",
      completed: true,
      href: "/organizer/event-management",
    },
  ],
  dailySales: [
    { day: "Mon", tickets: 8, revenue: 180 },
    { day: "Tue", tickets: 15, revenue: 340 },
    { day: "Wed", tickets: 12, revenue: 275 },
    { day: "Thu", tickets: 22, revenue: 510 },
    { day: "Fri", tickets: 35, revenue: 820 },
    { day: "Sat", tickets: 28, revenue: 650 },
    { day: "Sun", tickets: 18, revenue: 420 },
  ],
};

// ── Page Component ───────────────────────────────────────────────────────────

export default function EventOverviewPage() {
  return <EventOverviewClient data={MOCK_DATA} />;
}
