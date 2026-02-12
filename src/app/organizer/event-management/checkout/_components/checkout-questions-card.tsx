import { Download, MoreVertical } from "lucide-react";
import { InfoBanner } from "../../_components/info-banner";
import { SectionCard } from "../../_components/section-card";
import { SectionHeader } from "../../_components/section-header";

// ── Main Component ───────────────────────────────────────────────────────────

export function CheckoutQuestionsCard() {
  return (
    <SectionCard>
      <SectionHeader
        title="Checkout Questions"
        description="We collect emails via login credentials. Add custom questions to gather more data at checkout."
        onAdd={() => {}}
        actionLabel="Download Answers"
        actionIcon={<Download className="size-3.5" />}
      />
      <InfoBanner>
        Too many questions can hurt conversions. Keep it short and essential.
      </InfoBanner>
    </SectionCard>
  );
}
