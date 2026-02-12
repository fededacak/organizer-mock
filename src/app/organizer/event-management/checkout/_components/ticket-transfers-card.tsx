import { InfoBanner } from "../../_components/info-banner";
import { SectionCard } from "../../_components/section-card";
import { SectionHeader } from "../../_components/section-header";

export function TicketTransfersCard() {
  return (
    <SectionCard>
      <SectionHeader
        title="Ticket Transfers"
        description="Disabling transfers prevents ticket holders from changing the assigned attendee."
      />
      <InfoBanner>
        Keep terms concise and essential to maintain good conversion rates.
      </InfoBanner>
    </SectionCard>
  );
}
