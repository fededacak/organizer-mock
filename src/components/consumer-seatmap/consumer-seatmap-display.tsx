"use client";

import {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
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
 * Auto-fits content to the viewport on mount. Supports wheel zoom and pinch-to-zoom.
 *
 * Uses the negative-margin trick so the layout box always matches the visual
 * (transformed) size. This ensures proper centering and scroll behaviour at
 * every zoom level.
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
  // Tracks the content's natural (scale-1) dimensions so we can compensate margins
  const [contentSize, setContentSize] = useState({ width: 0, height: 0 });
  const fitScaleRef = useRef(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lastPinchDistRef = useRef<number | null>(null);

  // Measure the content's natural layout dimensions (unaffected by transform)
  const measureContent = useCallback(() => {
    const content = contentRef.current;
    if (!content) return;
    setContentSize({
      width: content.scrollWidth,
      height: content.scrollHeight,
    });
  }, []);

  // Calculate the scale needed to fit content within the container
  const calculateFitScale = useCallback(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return undefined;

    const containerW = container.clientWidth;
    const containerH = container.clientHeight;
    const contentW = content.scrollWidth;
    const contentH = content.scrollHeight;

    if (contentW === 0 || contentH === 0) return undefined;

    const padding = 24;
    const fit = Math.min(
      (containerW - padding) / contentW,
      (containerH - padding) / contentH,
      1, // don't zoom in past native size
    );
    const clamped = Math.max(MIN_SCALE, fit);
    fitScaleRef.current = clamped;
    return clamped;
  }, []);

  // Initial measurement + fit before first paint (no flash of wrong scale)
  useLayoutEffect(() => {
    measureContent();
    const fit = calculateFitScale();
    if (fit !== undefined) {
      setScale(fit);
    }
  }, [measureContent, calculateFitScale]);

  // Keep fitScale + contentSize up to date on resize
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      measureContent();
      calculateFitScale();
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [measureContent, calculateFitScale]);

  const handleZoomIn = useCallback(() => {
    setScale((prev) => Math.min(MAX_SCALE, prev * 1.2));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale((prev) => Math.max(MIN_SCALE, prev / 1.2));
  }, []);

  const handleResetZoom = useCallback(() => {
    const fit = calculateFitScale();
    setScale(fit ?? 1);
  }, [calculateFitScale]);

  // Wheel zoom (always centered)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const direction = e.deltaY > 0 ? -1 : 1;
      setScale((prev) => {
        const scaleBy = 1.1;
        const next = direction > 0 ? prev * scaleBy : prev / scaleBy;
        return Math.max(MIN_SCALE, Math.min(MAX_SCALE, next));
      });
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  // Pinch-to-zoom for touch devices
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        lastPinchDistRef.current = Math.hypot(
          t2.clientX - t1.clientX,
          t2.clientY - t1.clientY,
        );
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const dist = Math.hypot(
          t2.clientX - t1.clientX,
          t2.clientY - t1.clientY,
        );

        if (lastPinchDistRef.current !== null) {
          const delta = dist / lastPinchDistRef.current;
          setScale((prev) =>
            Math.max(MIN_SCALE, Math.min(MAX_SCALE, prev * delta)),
          );
        }

        lastPinchDistRef.current = dist;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) {
        lastPinchDistRef.current = null;
      }
    };

    container.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    container.addEventListener("touchend", handleTouchEnd);

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
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

  // Negative-margin compensation: makes the layout box match the visual
  // (transformed) size so overflow-auto scrolling and flex centering work
  // correctly at every zoom level.
  //   layout contribution = scrollWidth + marginRight
  //     = contentW + contentW*(scale-1) = contentW*scale  ✓ matches visual
  const marginRight =
    contentSize.width > 0 ? contentSize.width * (scale - 1) : 0;
  const marginBottom =
    contentSize.height > 0 ? contentSize.height * (scale - 1) : 0;

  return (
    <div className="relative flex h-full flex-1 flex-col overflow-hidden bg-light-gray">
      {/* Legend — hidden on mobile, positioned left of sidebar on desktop */}
      <div className="absolute md:right-[316px] md:bottom-2 z-30 hidden md:block">
        <ConsumerSeatmapLegend />
      </div>

      {/* Zoom controls — top-left on mobile (clear of close btn), bottom-left on desktop */}
      <div className="absolute left-3 md:bottom-2 top-3 md:top-auto z-30 items-end gap-2 hidden md:flex">
        <ZoomControls
          scale={scale}
          minScale={MIN_SCALE}
          maxScale={MAX_SCALE}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onReset={handleResetZoom}
        />
      </div>

      {/* Seatmap Container — scrollable viewport */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto md:pr-[300px] touch-manipulation"
      >
        {/* Centering wrapper: fills at least the full container so the
            content is centered when zoomed-to-fit, but grows when zoomed in
            to create scrollable area. */}
        <div className="flex min-h-full min-w-full items-center justify-center">
          <div
            ref={contentRef}
            className="flex flex-col items-center justify-center"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              willChange: "transform",
              marginRight: `${marginRight}px`,
              marginBottom: `${marginBottom}px`,
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
                  <ConsumerSectionBlock
                    section={floor}
                    {...sectionBlockProps}
                  />
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
                  <ConsumerSectionBlock
                    section={vipBox}
                    {...sectionBlockProps}
                  />
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
    </div>
  );
}
