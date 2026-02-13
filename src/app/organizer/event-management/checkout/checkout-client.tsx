"use client";

import { useState } from "react";
import { PageBreadcrumb } from "../_components/page-breadcrumb";
import { ToggleTabs } from "../_components/toggle-tabs";
import { CheckoutQuestionsCard } from "./_components/checkout-questions-card";
import { ConfirmationEmailCard } from "./_components/confirmation-email-card";
import { CheckoutTermsCard } from "./_components/checkout-terms-card";
import { TicketTransfersCard } from "./_components/ticket-transfers-card";

export function CheckoutClient() {
  const [activeTab, setActiveTab] = useState<"online" | "onsite">("online");

  return (
    <div className="flex flex-col gap-6">
      {/* ── Breadcrumb + View Event ──────────────────────────────── */}
      <PageBreadcrumb
        segments={[
          { label: "Events", href: "/organizer/home" },
          { label: "Illuminate Nights" },
        ]}
        action={{
          label: "View Event",
          href: "/organizer/event/illuminate-nights",
          external: true,
        }}
      />

      {/* ── Title ────────────────────────────────────────────────── */}
      <h1 className="font-outfit text-[22px] font-black text-black">
        Checkout
      </h1>

      {/* ── Tabs ─────────────────────────────────────────────────── */}
      <ToggleTabs
        tabs={[
          { label: "Online", value: "online" },
          { label: "On-site", value: "onsite" },
        ]}
        value={activeTab}
        onChange={setActiveTab}
      />

      {/* ── Two-column Grid ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* ── Left Column ──────────────────────────────────────── */}
        <div className="flex flex-col gap-5">
          <CheckoutQuestionsCard />
          <ConfirmationEmailCard />
        </div>

        {/* ── Right Column ─────────────────────────────────────── */}
        <div className="flex flex-col gap-5">
          <CheckoutTermsCard />
          <TicketTransfersCard />
        </div>
      </div>
    </div>
  );
}
