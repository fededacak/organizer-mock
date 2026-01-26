import Image from "next/image";
import type { Artist } from "./types";
import { MusicNoteIcon } from "../icons/music-note-icon";

interface ArtistCardProps {
  artist: Artist;
  onOpenModal: () => void;
}

export function ArtistCard({ artist, onOpenModal }: ArtistCardProps) {
  return (
    <button
      type="button"
      onClick={onOpenModal}
      className="bg-white dark:bg-[#141419] border border-light-gray dark:border-[#2a2a35] rounded-[16px] p-3 shadow-[0px_0px_5px_0px_rgba(0,0,0,0.08)] dark:shadow-[0px_0px_5px_0px_rgba(0,0,0,0.3)] flex items-center gap-3 cursor-pointer hover:bg-light-gray/50 dark:hover:bg-[#1a1a22] transition-colors duration-200 ease w-full text-left"
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
          <MusicNoteIcon size={18} className="text-white opacity-90" />
        </div>
      )}
      <p className="font-bold text-sm text-black dark:text-white">
        {artist.name}
      </p>
    </button>
  );
}
