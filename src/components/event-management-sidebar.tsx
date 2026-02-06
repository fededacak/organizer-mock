"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Ticket,
  CreditCard,
  Plug,
  ShoppingCart,
  BarChart3,
  Mail,
  MessageSquare,
  Bell,
  Tag,
  Link2,
  Smartphone,
  ScanLine,
  ExternalLink,
  SquarePen,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EventCard } from "./event-card";

interface MenuItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  external?: boolean;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const overviewItem: MenuItem = {
  id: "overview",
  label: "Overview",
  href: "/organizer/event-management",
  icon: <LayoutDashboard className="size-4" />,
};

const menuSections: MenuSection[] = [
  {
    title: "Event",
    items: [
      {
        id: "edit-event",
        label: "Edit Event",
        href: "/organizer/event-management/edit",
        icon: <SquarePen className="size-4" />,
      },
      {
        id: "tickets",
        label: "Tickets",
        href: "/organizer/event-management/tickets",
        icon: <Ticket className="size-4" />,
      },
      {
        id: "checkout",
        label: "Checkout",
        href: "/organizer/event-management/checkout",
        icon: <CreditCard className="size-4" />,
      },
      {
        id: "integrations",
        label: "Integrations",
        href: "/organizer/event-management/integrations",
        icon: <Plug className="size-4" />,
      },
    ],
  },
  {
    title: "Sales",
    items: [
      {
        id: "orders",
        label: "Orders",
        href: "/organizer/event-management/orders",
        icon: <ShoppingCart className="size-4" />,
      },
      {
        id: "analytics",
        label: "Analytics",
        href: "/organizer/event-management/analytics",
        icon: <BarChart3 className="size-4" />,
      },
    ],
  },
  {
    title: "Marketing",
    items: [
      {
        id: "email",
        label: "Email",
        href: "/organizer/event-management/email",
        icon: <Mail className="size-4" />,
      },
      {
        id: "sms",
        label: "SMS",
        href: "/organizer/event-management/sms",
        icon: <MessageSquare className="size-4" />,
      },
      {
        id: "push-notifications",
        label: "Push notifications",
        href: "/organizer/event-management/push-notifications",
        icon: <Bell className="size-4" />,
      },
      {
        id: "promo-codes",
        label: "Promo codes",
        href: "/organizer/event-management/promo-codes",
        icon: <Tag className="size-4" />,
      },
      {
        id: "tracking-links",
        label: "Tracking links",
        href: "/organizer/event-management/tracking-links",
        icon: <Link2 className="size-4" />,
      },
    ],
  },
];

const bottomMenuItems: MenuItem[] = [
  {
    id: "pos",
    label: "POS",
    href: "/organizer/pos",
    icon: <Smartphone className="size-4" />,
    external: true,
  },
  {
    id: "check-in",
    label: "Check In",
    href: "/organizer/check-in",
    icon: <ScanLine className="size-4" />,
    external: true,
  },
];

interface EventManagementSidebarProps {
  eventName?: string;
  eventDate?: string;
  eventStatus?: "Public" | "Private" | "Draft";
}

export function EventManagementSidebar({
  eventName = "Illuminate Nights",
  eventDate = "Apr 12, 7:00 PM",
  eventStatus = "Public",
}: EventManagementSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/organizer/event-management") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="flex h-full flex-col gap-2 rounded-[20px] bg-white p-2.5 shadow-[0px_4px_24px_0px_rgba(155,182,190,0.07)] w-[230px]">
      {/* Main Menu Button */}
      <Link
        href="/organizer/home"
        className="flex h-[38px] items-center gap-2 rounded-full bg-white px-2 py-2 transition-colors duration-200 ease hover:bg-light-gray"
      >
        <div className="flex size-[22px] items-center justify-center rounded-full bg-mid-gray">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="11"
            height="9"
            viewBox="0 0 11 9"
            fill="none"
          >
            <path
              d="M3.62 0.255247L0.32 3.55525C0.115 3.76025 -2.46095e-07 4.04025 -2.33419e-07 4.33025C-2.20743e-07 4.62025 0.115 4.90025 0.32 5.10525L3.62 8.40525C3.82 8.64025 4.105 8.77525 4.415 8.79025C4.725 8.80525 5.02 8.68525 5.235 8.47025C5.45 8.25525 5.57 7.95525 5.555 7.65025C5.545 7.34525 5.405 7.05525 5.17 6.85525L3.75 5.43525L9.9 5.43525C10.295 5.43525 10.655 5.22525 10.855 4.88525C11.05 4.54525 11.05 4.12525 10.855 3.78525C10.66 3.44525 10.295 3.23525 9.9 3.23525L3.75 3.23525L5.17 1.81525C5.415 1.53025 5.495 1.14525 5.39 0.790247C5.285 0.430247 5.005 0.155248 4.645 0.045248C4.29 -0.0597518 3.9 0.0202488 3.62 0.265249V0.255247Z"
              fill="white"
            />
          </svg>
        </div>
        <span className="font-outfit text-sm text-foreground">Main menu</span>
      </Link>

      <EventCard
        eventName={eventName}
        eventDate={eventDate}
        eventStatus={eventStatus}
      />

      {/* Navigation Sections */}
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
        <nav className="flex flex-1 flex-col gap-2">
          {/* Overview Item */}
          <Link
            href={overviewItem.href}
            className={cn(
              "flex items-center gap-2 rounded-full p-2 transition-colors duration-200 ease",
              isActive(overviewItem.href)
                ? "bg-[rgba(51,153,255,0.05)]"
                : "bg-white hover:bg-light-gray"
            )}
          >
            <span
              className={cn(
                isActive(overviewItem.href) ? "text-tp-blue" : "text-gray"
              )}
            >
              {overviewItem.icon}
            </span>
            <span
              className={cn(
                "font-outfit text-sm",
                isActive(overviewItem.href)
                  ? "font-semibold text-tp-blue"
                  : "font-normal text-foreground"
              )}
            >
              {overviewItem.label}
            </span>
          </Link>

          {menuSections.map((section, sectionIndex) => (
            <div key={section.title} className="flex flex-col">
              {/* Section Title */}
              <div className="px-2 py-1">
                <span className="font-outfit text-xs font-semibold text-gray">
                  {section.title}
                </span>
              </div>

              {/* Section Items */}
              <div className="flex flex-col gap-0.5">
                {section.items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 rounded-full p-2 transition-colors duration-200 ease",
                        active
                          ? "bg-[rgba(51,153,255,0.05)]"
                          : "bg-white hover:bg-light-gray"
                      )}
                    >
                      <span
                        className={cn(active ? "text-tp-blue" : "text-gray")}
                      >
                        {item.icon}
                      </span>
                      <span
                        className={cn(
                          "font-outfit text-sm",
                          active
                            ? "font-semibold text-tp-blue"
                            : "font-normal text-foreground"
                        )}
                      >
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>

              {/* Divider */}
              {sectionIndex < menuSections.length - 1 && (
                <div className="mx-2 my-2 h-px bg-[#f2f2f2]" />
              )}
            </div>
          ))}
        </nav>

        {/* Bottom Menu Items */}
        <div className="mt-auto flex flex-col gap-0.5">
          {bottomMenuItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="flex items-center justify-between rounded-full bg-white p-2 transition-colors duration-200 ease hover:bg-light-gray"
            >
              <div className="flex items-center gap-2">
                <span className="text-gray">{item.icon}</span>
                <span className="font-outfit text-sm text-foreground">
                  {item.label}
                </span>
              </div>
              {item.external && <ExternalLink className="size-3.5 text-gray" />}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
