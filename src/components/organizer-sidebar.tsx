"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Home,
  Calendar,
  ClipboardList,
  BarChart3,
  Wallet,
  Megaphone,
  Users,
  Building2,
  MessageSquare,
  ChevronsUpDown,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  iconBgColor: string;
}

const menuItems: MenuItem[] = [
  {
    label: "Home",
    href: "/organizer/home",
    icon: <Home className="size-[11px] text-white" strokeWidth={2.5} />,
    iconBgColor: "bg-tp-orange",
  },
  {
    label: "Events",
    href: "/organizer/event",
    icon: <Calendar className="size-[11px] text-white" strokeWidth={2.5} />,
    iconBgColor: "bg-[#6c31f5]",
  },
  {
    label: "Orders",
    href: "/organizer/orders",
    icon: <ClipboardList className="size-[11px] text-white" strokeWidth={2.5} />,
    iconBgColor: "bg-tp-blue",
  },
  {
    label: "Analytics",
    href: "/organizer/analytics",
    icon: <BarChart3 className="size-[11px] text-white" strokeWidth={2.5} />,
    iconBgColor: "bg-tp-red",
  },
  {
    label: "Payouts",
    href: "/organizer/payouts",
    icon: <Wallet className="size-[11px] text-white" strokeWidth={2.5} />,
    iconBgColor: "bg-tp-green",
  },
  {
    label: "Marketing",
    href: "/organizer/marketing",
    icon: <Megaphone className="size-[11px] text-white" strokeWidth={2.5} />,
    iconBgColor: "bg-tp-orange",
  },
  {
    label: "Audience",
    href: "/organizer/audience",
    icon: <Users className="size-[11px] text-white" strokeWidth={2.5} />,
    iconBgColor: "bg-[#ffe000]",
  },
  {
    label: "Company",
    href: "/organizer/company",
    icon: <Building2 className="size-[11px] text-white" strokeWidth={2.5} />,
    iconBgColor: "bg-[#6c31f5]",
  },
];

interface OrganizerSidebarProps {
  className?: string;
}

export function OrganizerSidebar({ className }: OrganizerSidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "relative flex h-full flex-col justify-between rounded-[20px] bg-white px-2.5 pb-2.5 pt-0 shadow-card",
        isCollapsed ? "w-[60px]" : "w-[230px]",
        className
      )}
      style={{
        transition: "width 0.25s cubic-bezier(0.23, 1, 0.32, 1)",
      }}
    >
      {/* Collapse button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-2.5 top-12 z-10 flex size-5 items-center justify-center rounded-full border border-light-gray bg-white shadow-sm transition-colors duration-200 ease hover:bg-light-gray"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <motion.div
          animate={{ rotate: isCollapsed ? 180 : 0 }}
          transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
        >
          <ChevronLeft className="size-3 text-gray" />
        </motion.div>
      </button>

      {/* Top section: Logo + Menu */}
      <div className="flex flex-1 flex-col gap-2.5 items-center min-h-0 min-w-0 w-full">
        {/* Logo header */}
        <div className="flex w-full flex-col items-center border-b border-light-gray py-[18px]">
          <div className="flex items-center gap-2">
            {/* TickPick blob logo */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 210 220"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="shrink-0"
            >
              <path
                d="M48.3485 92.641C36.8405 106.501 28.4109 122.649 23.6187 140.015C23.9111 140.161 24.2336 140.238 24.5606 140.238L80.7502 140.23C78.3962 106.848 61.0983 80.53 60.5863 79.759C56.2048 83.7554 52.115 88.0604 48.3485 92.641Z"
                fill="#0C177B"
              />
              <path
                d="M188.493 79.761H60.5856C60.5856 79.761 81.8275 111.536 80.9905 149.881C80.0215 194.292 57.1807 219.981 57.1807 219.981L119.194 219.991C119.493 217.819 120.365 215.767 121.722 214.045C126.362 208.028 136.106 205.563 142.822 209.321C146.856 211.577 148.473 215.734 148.122 220H186.122C186.122 220 207.208 195.273 209.49 153.512C212.012 107.35 188.491 79.761 188.491 79.761"
                fill="#185BDB"
              />
              <path
                d="M22.9087 139.436C19.3467 134.875 2.23182 111.136 0.18984 73.752C-2.08214 32.179 16.7677 5.66901 20.5387 0.810012C20.7342 0.557641 20.9849 0.353415 21.2716 0.213006C21.5584 0.0725958 21.8734 -0.000265544 22.1927 1.231e-05H59.6374C60.1727 -0.00182448 60.6884 0.201954 61.0778 0.569283C61.4673 0.936613 61.7009 1.43945 61.7303 1.97401C61.7633 3.79452 62.2724 5.57466 63.2072 7.1372C64.142 8.69974 65.4698 9.99017 67.0583 10.88C73.7762 14.638 83.5212 12.173 88.1581 6.15601C89.2167 4.80213 89.9868 3.24583 90.4211 1.58301C90.5329 1.13176 90.7923 0.730836 91.1581 0.443997C91.524 0.157159 91.9752 0.000878666 92.4401 1.231e-05H149.093C149.093 1.231e-05 127.851 31.774 128.693 70.12C128.765 73.438 128.96 76.653 129.258 79.76H60.5864C56.2045 83.756 52.1144 88.0607 48.3475 92.641C36.8397 106.501 28.4101 122.649 23.6177 140.015C23.3258 139.902 23.0783 139.699 22.9087 139.436Z"
                fill="#3399FF"
              />
            </svg>
            {!isCollapsed && (
              <span className="font-outfit text-sm font-semibold tracking-[0.15em] text-black whitespace-nowrap overflow-hidden">
                ORGANIZER
              </span>
            )}
          </div>
        </div>

        {/* Navigation menu */}
        <nav className="flex w-full flex-col gap-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex h-[38px] items-center gap-2.5 rounded-full p-2 transition-colors duration-200 ease",
                  isActive ? "bg-light-gray" : "bg-white hover:bg-light-gray/50",
                  isCollapsed && "justify-center"
                )}
              >
                <div
                  className={cn(
                    "flex size-[22px] shrink-0 items-center justify-center rounded-full",
                    item.iconBgColor
                  )}
                >
                  {item.icon}
                </div>
                {!isCollapsed && (
                  <span
                    className={cn(
                      "font-outfit text-sm whitespace-nowrap transition-opacity duration-150 ease-out",
                      isActive ? "font-semibold text-black" : "font-normal text-foreground"
                    )}
                  >
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom section: Feedback + Company switcher */}
      <div className="flex w-full flex-col gap-1">
        {/* Feedback link */}
        <Link
          href="/organizer/feedback"
          className={cn(
            "flex items-center gap-2 rounded-full px-2 py-[7px] transition-colors duration-200 ease hover:bg-light-gray/50",
            isCollapsed && "justify-center"
          )}
        >
          <MessageSquare className="size-4 shrink-0 text-gray" />
          {!isCollapsed && (
            <span className="font-outfit text-sm text-black">Feedback</span>
          )}
        </Link>

        {/* Company switcher */}
        <button
          className={cn(
            "flex w-full items-center gap-2.5 rounded-2xl border border-[#eef0f4] bg-white p-2 transition-colors duration-200 ease hover:bg-light-gray/30",
            isCollapsed && "justify-center"
          )}
        >
          <div className="flex flex-1 items-center gap-1.5 min-w-0">
            {/* Avatar */}
            <div className="relative size-8 shrink-0 overflow-hidden rounded-full border-2 border-black">
              <Image
                src="/organizer-avatar.jpg"
                alt="Company avatar"
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>
            {!isCollapsed && (
              <span className="flex-1 truncate text-left font-outfit text-xs font-semibold text-black">
                Test Company Name
              </span>
            )}
          </div>
          {!isCollapsed && (
            <ChevronsUpDown className="size-4 shrink-0 text-mid-gray" />
          )}
        </button>
      </div>
    </aside>
  );
}

