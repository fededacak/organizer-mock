import { Download } from "lucide-react";
import { InfoBanner } from "../../_components/info-banner";
import { SectionCard } from "../../_components/section-card";
import { SectionHeader } from "../../_components/section-header";

export function CheckoutTermsCard() {
  return (
    <SectionCard>
      <SectionHeader
        title="Checkout Terms"
        description="Add terms you'd like the customers to accept before placing an order."
        onAdd={() => {}}
        actionLabel="Download"
        actionIcon={<Download className="size-3.5" />}
      />
      <InfoBanner>
        Keep terms concise and essential to maintain good conversion rates.
      </InfoBanner>
    </SectionCard>
  );
}
