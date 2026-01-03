import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickAccessItemProps {
  title: string;
  description: string;
  href?: string;
  showBorder?: boolean;
}

function QuickAccessItem({
  title,
  description,
  href = "#",
  showBorder = true,
}: QuickAccessItemProps) {
  return (
    <a
      href={href}
      className={cn(
        "flex w-full items-center gap-4 bg-white pb-4 transition-colors duration-200 ease",
        showBorder && "border-b border-light-gray"
      )}
    >
      <div className="flex flex-1 flex-col gap-1.5">
        <h4 className="font-outfit text-base font-bold text-black">
          {title}
        </h4>
        <p className="font-outfit text-sm font-normal text-dark-gray">
          {description}
        </p>
      </div>
      <div className="flex shrink-0 items-start rounded-[10px] bg-light-gray p-2">
        <ExternalLink className="size-4 text-dark-gray" />
      </div>
    </a>
  );
}

interface QuickAccessCardProps {
  className?: string;
}

export function QuickAccessCard({ className }: QuickAccessCardProps) {
  const items: Omit<QuickAccessItemProps, "showBorder">[] = [
    {
      title: "Book demo",
      description:
        "Get the most out of our platform with a personalized walkthrough.",
      href: "#",
    },
    {
      title: "Contact support",
      description: "Questions, feature requests, tips and tricks.",
      href: "#",
    },
    {
      title: "Launch a new campaign",
      description: "Email, SMS and push notifications.",
      href: "#",
    },
    {
      title: "Segment your contacts",
      description: "Target the right audience.",
      href: "#",
    },
    {
      title: "FAQ",
      description: "Have questions? We're here to help.",
      href: "#",
    },
    {
      title: "Set up your team",
      description: "Add admins, scanners and marketers",
      href: "#",
    },
  ];

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-6 rounded-[20px] bg-white p-6 shadow-card",
        className
      )}
    >
      <h2 className="font-outfit text-xl font-black text-black">
        Quick Access
      </h2>
      <div className="flex flex-col gap-5">
        {items.map((item, index) => (
          <QuickAccessItem
            key={item.title}
            {...item}
            showBorder={index < items.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

