"use client";

import { useState } from "react";
import { ArtistCard } from "./artist-card";
import { SectionHeader } from "./section-header";
import type { Artist } from "./types";
import { ArtistModal, type LineupDisplaySettings } from "./artist-modal";

interface LineupSectionProps {
  lineup: Artist[];
  hideBorder?: boolean;
  displaySettings?: LineupDisplaySettings;
}

export function LineupSection({
  lineup,
  hideBorder,
  displaySettings,
}: LineupSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArtistIndex, setSelectedArtistIndex] = useState(0);

  const handleOpenModal = (index: number) => {
    setSelectedArtistIndex(index);
    setIsModalOpen(true);
  };

  return (
    <>
      <section
        className={
          hideBorder
            ? ""
            : "pb-6 lg:pb-4 border-b border-light-gray dark:border-[#2a2a35]"
        }
      >
        <SectionHeader title="Lineup" />
        <div className="flex flex-col gap-3">
          {lineup.map((artist, index) => (
            <ArtistCard
              key={artist.id}
              artist={artist}
              onOpenModal={() => handleOpenModal(index)}
            />
          ))}
        </div>
      </section>

      <ArtistModal
        artists={lineup}
        selectedIndex={selectedArtistIndex}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSelectArtist={setSelectedArtistIndex}
        displaySettings={displaySettings}
      />
    </>
  );
}
