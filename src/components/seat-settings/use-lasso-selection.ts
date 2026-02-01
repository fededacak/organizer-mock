"use client";

import { useState, useCallback, useEffect } from "react";

export interface UseLassoSelectionOptions {
  seatRefs: React.MutableRefObject<Map<string, HTMLButtonElement>>;
  onSelectSeats: (seatIds: string[], additive?: boolean) => void;
  isSpacePressed: boolean;
}

export interface UseLassoSelectionReturn {
  lassoStart: { x: number; y: number } | null;
  lassoEnd: { x: number; y: number } | null;
  lassoSeats: Set<string>;
  handleLassoMouseDown: (e: React.MouseEvent) => void;
}

/**
 * Custom hook for lasso (drag-to-select) functionality
 * Handles drawing selection rectangle and detecting seats within it
 */
export function useLassoSelection({
  seatRefs,
  onSelectSeats,
  isSpacePressed,
}: UseLassoSelectionOptions): UseLassoSelectionReturn {
  const [lassoStart, setLassoStart] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [lassoEnd, setLassoEnd] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [lassoSeats, setLassoSeats] = useState<Set<string>>(new Set());

  // Check if a seat element is within the lasso rectangle
  const isSeatInLasso = useCallback(
    (
      seatEl: HTMLButtonElement,
      start: { x: number; y: number },
      end: { x: number; y: number },
    ) => {
      const rect = seatEl.getBoundingClientRect();
      const lassoLeft = Math.min(start.x, end.x);
      const lassoRight = Math.max(start.x, end.x);
      const lassoTop = Math.min(start.y, end.y);
      const lassoBottom = Math.max(start.y, end.y);

      // Check if seat center is within lasso
      const seatCenterX = rect.left + rect.width / 2;
      const seatCenterY = rect.top + rect.height / 2;

      return (
        seatCenterX >= lassoLeft &&
        seatCenterX <= lassoRight &&
        seatCenterY >= lassoTop &&
        seatCenterY <= lassoBottom
      );
    },
    [],
  );

  // Update lasso seats during drag
  useEffect(() => {
    if (!lassoStart || !lassoEnd) {
      setLassoSeats(new Set());
      return;
    }

    const seatsInLasso = new Set<string>();
    seatRefs.current.forEach((el, seatId) => {
      if (isSeatInLasso(el, lassoStart, lassoEnd)) {
        seatsInLasso.add(seatId);
      }
    });
    setLassoSeats(seatsInLasso);
  }, [lassoStart, lassoEnd, isSeatInLasso, seatRefs]);

  // Handle mouse move for lasso
  useEffect(() => {
    if (!lassoStart) return;

    const handleMouseMove = (e: MouseEvent) => {
      setLassoEnd({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      if (lassoSeats.size > 0) {
        // Always additive - stack lasso selections
        onSelectSeats(Array.from(lassoSeats), true);
      }
      setLassoStart(null);
      setLassoEnd(null);
      setLassoSeats(new Set());
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [lassoStart, lassoSeats, onSelectSeats]);

  // Handle mouse down to start lasso
  const handleLassoMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Only start lasso if clicking on the container background, not on a seat
      const target = e.target as HTMLElement;
      if (target.hasAttribute("data-seat-id")) return;

      // Left click starts lasso selection (only if not in panning mode)
      if (e.button === 0 && !isSpacePressed) {
        setLassoStart({ x: e.clientX, y: e.clientY });
        setLassoEnd({ x: e.clientX, y: e.clientY });
      }
    },
    [isSpacePressed],
  );

  return {
    lassoStart,
    lassoEnd,
    lassoSeats,
    handleLassoMouseDown,
  };
}
