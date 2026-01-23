"use client";

import Image from "next/image";
import { SectionHeader } from "./section-header";

const SAMPLE_SPONSORS = [
  { id: "google", name: "Google", logo: "/sponsors/google.png" },
  { id: "paypal", name: "PayPal", logo: "/sponsors/paypal.png" },
  { id: "skype", name: "Skype", logo: "/sponsors/skype.png" },
  { id: "adobe", name: "Adobe", logo: "/sponsors/adobe.png" },
  { id: "fedex", name: "FedEx", logo: "/sponsors/fedex.jpg" },
];

interface Sponsor {
  id: string;
  name: string;
  logo: string;
}

interface SponsorsSectionProps {
  sponsors?: Sponsor[];
}

export function SponsorsSection({
  sponsors = SAMPLE_SPONSORS,
}: SponsorsSectionProps) {
  return (
    <section className={`w-full px-4 md:px-8 lg:px-6 max-w-[1064px]`}>
      <div className="border-t border-light-gray dark:border-[#2a2a35] pt-8 pb-10 flex flex-col">
        <SectionHeader title="Sponsors" />
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {sponsors.map((sponsor) => (
            <SponsorCard key={sponsor.id} sponsor={sponsor} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
  return (
    <div
      className="aspect-square bg-light-gray dark:bg-[#1e1e26] rounded-[20px] p-5 flex items-center justify-center overflow-hidden"
      title={sponsor.name}
    >
      <Image
        src={sponsor.logo}
        alt={sponsor.name}
        width={200}
        height={200}
        className="w-full h-full object-contain"
      />
    </div>
  );
}
