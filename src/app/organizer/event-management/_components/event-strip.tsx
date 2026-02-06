"use client";

import { cn } from "@/lib/utils";
import { ArrowUpRight, Check, Copy, ExternalLink, Pencil } from "lucide-react";
import { MapPinIcon } from "@/components/icons/map-pin-icon";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

export interface EventCardProps {
  eventName: string;
  eventImageUrl: string;
  eventLink: string;
  eventDate: Date;
  formattedDate: string;
  formattedTime: string;
  venue: string;
  address: string;
  daysAway: number;
}

export function EventCard({
  eventName,
  eventImageUrl,
  eventLink,
  eventDate,
  formattedDate,
  formattedTime,
  venue,
  address,
  daysAway,
}: EventCardProps) {
  const [linkCopied, setLinkCopied] = useState(false);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(eventLink);
      setLinkCopied(true);
      toast.success("Event link copied to clipboard");
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  }, [eventLink]);

  // Strip protocol for display
  const displayLink = eventLink.replace(/^https?:\/\//, "");

  return (
    <div className="flex overflow-hidden rounded-[20px] bg-white shadow-card p-6 items-start justify-start">
      <div className="flex flex-col gap-2">
        {/* ── Image ────────────────────────────────────────────── */}
        <div className="relative h-full w-[400px] shrink-0 rounded-[12px] overflow-hidden aspect-5/2 bg-amber-400">
          <Image
            src={eventImageUrl}
            alt={eventName}
            fill
            className="object-cover"
            sizes="200px"
          />
        </div>
        {/* Event Link */}
        <button
          onClick={handleCopyLink}
          className="group flex w-fit items-center gap-1.5 rounded-md bg-light-gray/60 px-2 py-1 transition-colors duration-200 ease hover:bg-light-gray"
        >
          <span className="truncate font-open-sans text-[11px] tracking-wide text-dark-gray">
            {displayLink}
          </span>
          {linkCopied ? (
            <Check className="size-3 shrink-0 text-[#00b386]" />
          ) : (
            <Copy className="size-3 shrink-0 text-gray transition-colors duration-200 ease group-hover:text-dark-gray" />
          )}
        </button>
        {/* Bottom: Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/organizer/event-management/edit"
            className="flex items-center gap-1.5 rounded-full border border-[#ebebeb] px-3 py-1.5 transition-colors duration-200 ease hover:border-[#ddd] hover:bg-light-gray/50"
          >
            <Pencil className="size-3 text-dark-gray" />
            <span className="font-outfit text-[11px] font-semibold text-dark-gray">
              Edit Details
            </span>
          </Link>

          <button
            onClick={handleCopyLink}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors duration-200 ease",
              linkCopied
                ? "bg-[#00b386]/8 text-[#00b386]"
                : "bg-tp-blue/5 hover:bg-tp-blue/10",
            )}
          >
            {linkCopied ? (
              <Check className="size-3" />
            ) : (
              <Copy className="size-3 text-tp-blue" />
            )}
            <span
              className={cn(
                "font-outfit text-[11px] font-semibold",
                linkCopied ? "text-[#00b386]" : "text-tp-blue",
              )}
            >
              {linkCopied ? "Copied!" : "Copy Link"}
            </span>
          </button>

          <a
            href={eventLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full border border-[#ebebeb] px-3 py-1.5 transition-colors duration-200 ease hover:border-[#ddd] hover:bg-light-gray/50"
            aria-label="Open event page in new tab"
          >
            <ExternalLink className="size-3 text-dark-gray" />
            <span className="font-outfit text-[11px] font-semibold text-dark-gray">
              Open
            </span>
          </a>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col justify-between px-5 py-4">
        {/* Top: Info */}
        <div className="flex flex-col gap-2">
          {/* Name + countdown */}
          <div className="flex items-center gap-4">
            <span className="font-outfit text-2xl font-extrabold tracking-tight text-tp-blue">
              {daysAway}
            </span>
            <span className="font-open-sans text-[10px] font-semibold leading-none text-dark-gray">
              days
              <br />
              away
            </span>
          </div>

          {/* When & Where */}
          <div className="flex flex-col gap-3">
            {/* Date row */}
            <div className="flex items-center gap-3">
              <DateIcon date={eventDate} />
              <div className="flex flex-col">
                <span className="font-open-sans text-[13px] font-semibold text-dark-gray">
                  {formattedDate}
                </span>
                <span className="font-open-sans text-[12px] text-gray">
                  {formattedTime}
                </span>
              </div>
            </div>

            {/* Location row */}
            <div className="flex items-center gap-3">
              <div className="flex size-[44px] shrink-0 items-center justify-center rounded-[10px] bg-[#f5f5f5]">
                <MapPinIcon size={20} className="text-[#b0b0b0]" />
              </div>
              <div className="flex flex-col">
                <span className="flex items-center gap-1 font-open-sans text-[13px] font-semibold text-dark-gray">
                  {venue}
                  <ArrowUpRight className="size-3.5 text-gray" />
                </span>
                <span className="font-open-sans text-[12px] text-gray">
                  {address}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Calendar date icon ──────────────────────────────────────────────────── */

function DateIcon({ date }: { date: Date }) {
  const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const day = date.getDate();

  return (
    <div className="flex size-[44px] shrink-0 flex-col items-center justify-center overflow-hidden rounded-[10px] bg-[#f5f5f5]">
      <span className="font-open-sans text-[9px] font-bold uppercase leading-none tracking-wider text-tp-blue">
        {month}
      </span>
      <span className="font-outfit text-[20px] font-bold leading-tight text-[#2a2a2a]">
        {day}
      </span>
    </div>
  );
}
