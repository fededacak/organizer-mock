import Image from "next/image";
import { SectionHeader } from "./section-header";
import type { Artist } from "./types";

interface LineupSectionProps {
  lineup: Artist[];
}

export function LineupSection({ lineup }: LineupSectionProps) {
  return (
    <section>
      <SectionHeader title="Lineup" />
      <div className="flex flex-col gap-3">
        {lineup.map((artist) => (
          <div
            key={artist.id}
            className="bg-white dark:bg-[#141419] border border-light-gray dark:border-[#2a2a35] rounded-[16px] p-3 shadow-[0px_0px_5px_0px_rgba(0,0,0,0.08)] dark:shadow-[0px_0px_5px_0px_rgba(0,0,0,0.3)] flex items-center gap-3"
          >
            {artist.hasImage ? (
              <div className="w-[30px] h-[30px] rounded-[11px] bg-mid-gray dark:bg-[#3a3a45] overflow-hidden">
                <Image
                  src="/lineup-avatar.jpg"
                  alt={artist.name}
                  width={30}
                  height={30}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-[30px] h-[30px] rounded-[11px] bg-tp-orange flex items-center justify-center">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="white"
                  className="opacity-90"
                >
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
              </div>
            )}
            <p className="font-bold text-sm text-black dark:text-white">
              {artist.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
