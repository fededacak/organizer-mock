import Image from "next/image";
import { cn } from "@/lib/utils";

interface StatItemProps {
  value: number;
  label: string;
}

function StatItem({ value, label }: StatItemProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl bg-light-gray px-3 py-2.5">
      <span className="font-outfit text-lg font-extrabold text-black">
        {value}
      </span>
      <span className="font-outfit text-sm font-bold text-dark-gray">
        {label}
      </span>
    </div>
  );
}

interface OrganizerProfileCardProps {
  avatarUrl?: string;
  name?: string;
  eventsCount?: number;
  contactsCount?: number;
  followersCount?: number;
  className?: string;
}

export function OrganizerProfileCard({
  avatarUrl = "/organizer-avatar.jpg",
  name = "DUDE IDK",
  eventsCount = 82,
  contactsCount = 534,
  followersCount = 24,
  className,
}: OrganizerProfileCardProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-5 rounded-[20px] bg-white p-6",
        className
      )}
    >
      {/* Avatar and name */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative size-[100px] overflow-hidden rounded-full">
          <Image
            src={avatarUrl}
            alt={name}
            fill
            className="object-cover"
            sizes="100px"
          />
        </div>
        <div className="flex w-full items-center justify-center">
          <h3 className="font-outfit text-lg font-extrabold text-black">
            {name}
          </h3>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex gap-2">
        <StatItem value={eventsCount} label="Events" />
        <StatItem value={contactsCount} label="Contacts" />
        <StatItem value={followersCount} label="Followers" />
      </div>
    </div>
  );
}




