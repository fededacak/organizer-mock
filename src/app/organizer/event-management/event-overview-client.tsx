"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import { EventCard } from "./_components/event-strip";
import type { EventOverviewData } from "./page";
import { StatCard } from "./_components/stat-card";

// ── Animation Variants ───────────────────────────────────────────────────────

function useStaggerVariants() {
  const shouldReduceMotion = useReducedMotion();

  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.07,
      },
    },
  };

  const item = shouldReduceMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 14 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            type: "spring" as const,
            stiffness: 380,
            damping: 28,
          },
        },
      };

  const statsContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.04,
      },
    },
  };

  return { container, item, statsContainer };
}

// ── Main Component ───────────────────────────────────────────────────────────

export function EventOverviewClient({ data }: { data: EventOverviewData }) {
  const { container, item, statsContainer } = useStaggerVariants();
  // ── Computed values ──
  const eventDate = useMemo(
    () => new Date(`${data.event.date}T${data.event.time}`),
    [data.event.date, data.event.time],
  );

  const formattedDate = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(eventDate),
    [eventDate],
  );

  const formattedTime = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(eventDate),
    [eventDate],
  );

  const daysAway = useMemo(() => {
    const now = new Date();
    return Math.max(
      0,
      Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
    );
  }, [eventDate]);

  const eventLink = `https://tickpick.com/event/${data.event.name.toLowerCase().replace(/\s+/g, "-")}`;

  // ── Render ──
  return (
    <motion.div
      className="flex flex-col gap-8"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      <h1 className="text-[28px] font-extrabold text-black">
        Illuminate Nights
      </h1>
      {/* ── Event Card + Stats ───────────────────────────────────────── */}
      <div className="flex flex-col gap-5">
        <motion.div variants={item}>
          <EventCard
            eventName={data.event.name}
            eventImageUrl="/event-image.jpg"
            eventLink={eventLink}
            eventDate={eventDate}
            formattedDate={formattedDate}
            formattedTime={formattedTime}
            venue={data.event.venue}
            address={data.event.address}
            daysAway={daysAway}
          />
        </motion.div>

        {/* ── Stats Row ───────────────────────────────────────────────────── */}
        <motion.div
          className="grid grid-cols-4 gap-3"
          variants={statsContainer}
        >
          <motion.div variants={item}>
            <StatCard
              label="Total Revenue"
              value={data.stats.totalRevenue}
              prefix="$"
              trend={{ value: data.stats.revenueChange, positive: true }}
            />
          </motion.div>
          <motion.div variants={item}>
            <StatCard
              label="Tickets Sold"
              value={data.stats.ticketsSold}
              secondaryValue={`/ ${data.stats.ticketsTotal}`}
            />
          </motion.div>
          <motion.div variants={item}>
            <StatCard
              label="Page Views"
              value={data.stats.pageViews}
              trend={{ value: data.stats.viewsChange, positive: true }}
            />
          </motion.div>
          <motion.div variants={item}>
            <StatCard
              label="Conversion Rate"
              value={data.stats.conversionRate}
              suffix="%"
              decimals={1}
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
