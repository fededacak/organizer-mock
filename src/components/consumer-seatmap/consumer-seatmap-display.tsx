"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import type { Section, Hold } from "../seat-settings/types";
import { ZoomControls } from "../seat-settings/zoom-controls";
import { MIN_SCALE, MAX_SCALE } from "../seat-settings/seatmap-utils";
import { ConsumerSectionBlock } from "./consumer-section-block";
import { ConsumerSeatmapLegend } from "./consumer-seatmap-legend";

interface ConsumerSeatmapDisplayProps {
  sections: Section[];
  holds: Hold[];
  selectedSeats: Set<string>;
  unlockedHolds: Set<string>;
  onSelectSeat: (seatId: string) => void;
  onLockedClick: (hold: Hold) => void;
}

/**
 * Consumer seatmap display component
 * Renders an interactive seatmap for consumers to select seats.
 * Content is always centered — only zoom in/out is supported (no panning).
 */
export function ConsumerSeatmapDisplay({
  sections,
  holds,
  selectedSeats,
  unlockedHolds,
  onSelectSeat,
  onLockedClick,
}: ConsumerSeatmapDisplayProps) {
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = useCallback(() => {
    setScale((prev) => Math.min(MAX_SCALE, prev * 1.2));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale((prev) => Math.max(MIN_SCALE, prev / 1.2));
  }, []);

  const handleResetZoom = useCallback(() => {
    setScale(1);
  }, []);

  // Wheel zoom (always centered)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const direction = e.deltaY > 0 ? -1 : 1;
      setScale((prev) => {
        const scaleBy = 1.1;
        const next =
          direction > 0 ? prev * scaleBy : prev / scaleBy;
        return Math.max(MIN_SCALE, Math.min(MAX_SCALE, next));
      });
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  // Create hold map for quick lookup by holdId
  const holdMap = useMemo(() => {
    const map = new Map<string, Hold>();
    for (const hold of holds) {
      map.set(hold.id, hold);
    }
    return map;
  }, [holds]);

  // Find sections by name for positioning
  const floor = sections.find((s) => s.name === "Floor");
  const balconyLeft = sections.find((s) => s.name === "Balcony Left");
  const balconyRight = sections.find((s) => s.name === "Balcony Right");
  const vipBox = sections.find((s) => s.name === "VIP Box");
  const upperDeck = sections.find((s) => s.name === "Upper Deck");

  // Shared props for all section blocks
  const sectionBlockProps = {
    selectedSeats,
    unlockedHolds,
    holdMap,
    onSelectSeat,
    onLockedClick,
  };

  return (
    <div className="relative flex h-full flex-1 flex-col overflow-hidden bg-light-gray">
      {/* Floating Controls */}
      <div className="absolute left-2.5 top-2.5 z-30 flex gap-2">
        <ConsumerSeatmapLegend />
      </div>
      <div className="absolute left-2.5 bottom-2.5 z-30 flex gap-2">
        <ZoomControls
          scale={scale}
          minScale={MIN_SCALE}
          maxScale={MAX_SCALE}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onReset={handleResetZoom}
        />
      </div>

      {/* Seatmap Container — centered, no panning */}
      <div
        ref={containerRef}
        className="flex flex-1 items-center justify-center overflow-auto"
      >
        <div
          className="flex flex-col items-center justify-center"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "center center",
            willChange: "transform",
          }}
        >
          <div className="flex w-full max-w-[800px] flex-col items-center gap-5 py-16">
            {/* Stage */}
            <div className="flex h-16 w-full max-w-[450px] items-center justify-center rounded-[8px] bg-gray-800">
              <span className="text-xs font-bold tracking-widest text-white">
                STAGE
              </span>
            </div>

            {/* Main seating area: Balcony Left - Floor - Balcony Right */}
            <div className="flex w-full items-start justify-center gap-3">
              {balconyLeft && (
                <ConsumerSectionBlock
                  section={balconyLeft}
                  {...sectionBlockProps}
                />
              )}
              {floor && (
                <ConsumerSectionBlock section={floor} {...sectionBlockProps} />
              )}
              {balconyRight && (
                <ConsumerSectionBlock
                  section={balconyRight}
                  {...sectionBlockProps}
                />
              )}
            </div>

            {/* Bottom row: VIP Box and Upper Deck */}
            <div className="flex items-start justify-center gap-3">
              {vipBox && (
                <ConsumerSectionBlock section={vipBox} {...sectionBlockProps} />
              )}
              {upperDeck && (
                <ConsumerSectionBlock
                  section={upperDeck}
                  {...sectionBlockProps}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
