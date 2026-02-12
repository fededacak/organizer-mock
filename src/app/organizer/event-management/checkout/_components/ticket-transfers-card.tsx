"use client";

import { useState } from "react";
import { SectionCard } from "../../_components/section-card";
import { SectionHeader } from "../../_components/section-header";
import { TransferPolicyBadge } from "./transfer-policy-badge";
import {
  TicketTransfersModal,
  type TransferSettings,
} from "./ticket-transfers-modal";

function describePolicy(settings: TransferSettings): {
  label: string;
  description?: string;
} {
  switch (settings.policy) {
    case "until-event":
      return {
        label: "Transfers enabled",
        description: "Allowed until the event starts",
      };
    case "days-before": {
      const n = settings.cutoffDays || "0";
      return {
        label: "Transfers enabled",
        description: `Closes ${n} day${n === "1" ? "" : "s"} before the event on Feb 14, 2026`,
      };
    }
    case "never":
      return {
        label: "Transfers disabled",
        description: "Customers cannot transfer their tickets",
      };
  }
}

export function TicketTransfersCard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [settings, setSettings] = useState<TransferSettings>({
    policy: "until-event",
    cutoffDays: "",
  });

  return (
    <>
      <SectionCard>
        <SectionHeader
          title="Ticket Transfers"
          description="Control whether ticket holders can transfer their tickets to someone else."
        />

        <TransferPolicyBadge
          {...describePolicy(settings)}
          allowed={settings.policy !== "never"}
          onEdit={() => setModalOpen(true)}
        />
      </SectionCard>

      <TicketTransfersModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        settings={settings}
        onSave={setSettings}
      />
    </>
  );
}
