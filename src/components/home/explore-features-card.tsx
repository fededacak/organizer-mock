import {
  Wifi,
  Link as LinkIcon,
  MessageSquare,
  FolderOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureItemProps {
  icon: React.ReactNode;
  iconBgColor: string;
  title: string;
  description: string;
  buttonText: string;
  buttonColor: string;
}

function FeatureItem({
  icon,
  iconBgColor,
  title,
  description,
  buttonText,
  buttonColor,
}: FeatureItemProps) {
  return (
    <div className="flex flex-1 flex-col gap-5 overflow-hidden rounded-[20px] bg-light-gray p-5">
      <div
        className={cn(
          "flex size-12 items-center justify-center rounded-2xl",
          iconBgColor
        )}
      >
        {icon}
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2 text-black">
          <h3 className="font-outfit text-base font-bold">{title}</h3>
          <p className="font-outfit text-sm font-normal">{description}</p>
        </div>
        <button
          className={cn(
            "w-fit rounded-full px-4 py-2 font-outfit text-sm font-bold text-white transition-opacity duration-200 ease hover:opacity-90",
            buttonColor
          )}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}

interface ExploreFeaturesCardProps {
  className?: string;
}

export function ExploreFeaturesCard({ className }: ExploreFeaturesCardProps) {
  const features: FeatureItemProps[] = [
    {
      icon: <Wifi className="size-[22px] text-tp-blue" />,
      iconBgColor: "bg-[#deefff]",
      title: "Tap To Pay",
      description: "Accept contactless payments, right on your phone.",
      buttonText: "Play Demo Video",
      buttonColor: "bg-tp-blue",
    },
    {
      icon: <LinkIcon className="size-6 text-tp-red" />,
      iconBgColor: "bg-[#ffe9f2]",
      title: "Tracking Links",
      description:
        "Use custom links to track views, orders and revenue from different sources.",
      buttonText: "See In Action",
      buttonColor: "bg-tp-red",
    },
    {
      icon: <MessageSquare className="size-6 text-[#185bdb]" />,
      iconBgColor: "bg-[#e3edff]",
      title: "SMS Marketing",
      description:
        "Reach your audience where they are most active - on their phones.",
      buttonText: "Check Feature",
      buttonColor: "bg-[#185bdb]",
    },
    {
      icon: <FolderOpen className="size-6 text-[#6c31f5]" />,
      iconBgColor: "bg-[rgba(108,49,245,0.1)]",
      title: "Folders for Add-ons",
      description:
        "Organize and categorize add-ons, and encourage higher order values",
      buttonText: "Play Demo Video",
      buttonColor: "bg-[#6c31f5]",
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
        Explore Our Features
      </h2>
      <div className="flex flex-col gap-2.5">
        {/* Top row */}
        <div className="flex gap-2.5">
          <FeatureItem {...features[0]} />
          <FeatureItem {...features[1]} />
        </div>
        {/* Bottom row */}
        <div className="flex gap-2.5">
          <FeatureItem {...features[2]} />
          <FeatureItem {...features[3]} />
        </div>
      </div>
    </div>
  );
}

