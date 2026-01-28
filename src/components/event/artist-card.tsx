"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Artist } from "./types";
import { MusicNoteIcon } from "../icons/music-note-icon";

interface ArtistCardProps {
  artist: Artist;
  onOpenModal: () => void;
}

export function ArtistCard({ artist, onOpenModal }: ArtistCardProps) {
  return (
    <motion.button
      type="button"
      layoutId={`card-${artist.id}`}
      onClick={onOpenModal}
      className="bg-white dark:bg-[#141419] border border-light-gray dark:border-[#2a2a35] p-3 shadow-[0px_0px_5px_0px_rgba(0,0,0,0.08)] dark:shadow-[0px_0px_5px_0px_rgba(0,0,0,0.3)] flex items-center gap-3 cursor-pointer hover:bg-light-gray/50 dark:hover:bg-[#1a1a22] transition-colors duration-200 ease w-full text-left"
      style={{ borderRadius: 16 }}
    >
      {artist.hasImage ? (
        <motion.div
          layoutId={`image-${artist.id}`}
          className="w-[30px] h-[30px] bg-mid-gray dark:bg-[#3a3a45] overflow-hidden shrink-0"
          style={{ borderRadius: 11 }}
        >
          <Image
            src="/lineup-avatar.jpg"
            alt={artist.name}
            width={30}
            height={30}
            className="w-full h-full object-cover"
          />
        </motion.div>
      ) : (
        <motion.div
          layoutId={`image-${artist.id}`}
          className="w-[30px] h-[30px] bg-tp-orange flex items-center justify-center shrink-0"
          style={{ borderRadius: 11 }}
        >
          <MusicNoteIcon size={18} className="text-white opacity-90" />
        </motion.div>
      )}
      <motion.p
        layoutId={`name-${artist.id}`}
        layout="position"
        className="font-bold text-sm text-black dark:text-white"
      >
        {artist.name}
      </motion.p>
    </motion.button>
  );
}
