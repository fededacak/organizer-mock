"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { Viewport } from "./seatmap-utils";
import { MIN_SCALE, MAX_SCALE } from "./seatmap-utils";

export interface UseViewportOptions {
  initialViewport?: Viewport;
}

export interface UseViewportReturn {
  viewport: Viewport;
  isPanning: boolean;
  isSpacePressed: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleResetZoom: () => void;
  getCursor: () => string;
  handleContainerMouseDown: (e: React.MouseEvent) => boolean;
}

/**
 * Custom hook for viewport zoom/pan functionality
 * Handles wheel zoom, keyboard panning (space+drag), and zoom controls
 */
export function useViewport(
  options: UseViewportOptions = {},
): UseViewportReturn {
  const { initialViewport = { x: 0, y: 0, scale: 1 } } = options;

  const [viewport, setViewport] = useState<Viewport>(initialViewport);
  const [isPanning, setIsPanning] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Handle wheel zoom (centered on cursor position)
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const oldScale = viewport.scale;
      const direction = e.deltaY > 0 ? -1 : 1;
      const scaleBy = 1.1;
      let newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
      newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));

      // Zoom toward/from mouse position
      const mousePointTo = {
        x: (mouseX - viewport.x) / oldScale,
        y: (mouseY - viewport.y) / oldScale,
      };

      setViewport({
        x: mouseX - mousePointTo.x * newScale,
        y: mouseY - mousePointTo.y * newScale,
        scale: newScale,
      });
    },
    [viewport],
  );

  // Attach wheel event listener (needs passive: false for preventDefault)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  // Handle space key for panning mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.repeat) {
        e.preventDefault();
        setIsSpacePressed(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setIsSpacePressed(false);
        setIsPanning(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Handle panning with mouse movement
  useEffect(() => {
    if (!isPanning) return;

    const handleMouseMove = (e: MouseEvent) => {
      setViewport((prev) => ({
        ...prev,
        x: prev.x + e.movementX,
        y: prev.y + e.movementY,
      }));
    };

    const handleMouseUp = () => {
      setIsPanning(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isPanning]);

  // Zoom control handlers
  const handleZoomIn = useCallback(() => {
    setViewport((prev) => {
      const container = containerRef.current;
      if (!container) return prev;

      const rect = container.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const oldScale = prev.scale;
      const newScale = Math.min(MAX_SCALE, oldScale * 1.2);

      const centerPointTo = {
        x: (centerX - prev.x) / oldScale,
        y: (centerY - prev.y) / oldScale,
      };

      return {
        x: centerX - centerPointTo.x * newScale,
        y: centerY - centerPointTo.y * newScale,
        scale: newScale,
      };
    });
  }, []);

  const handleZoomOut = useCallback(() => {
    setViewport((prev) => {
      const container = containerRef.current;
      if (!container) return prev;

      const rect = container.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const oldScale = prev.scale;
      const newScale = Math.max(MIN_SCALE, oldScale / 1.2);

      const centerPointTo = {
        x: (centerX - prev.x) / oldScale,
        y: (centerY - prev.y) / oldScale,
      };

      return {
        x: centerX - centerPointTo.x * newScale,
        y: centerY - centerPointTo.y * newScale,
        scale: newScale,
      };
    });
  }, []);

  const handleResetZoom = useCallback(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) {
      setViewport({ x: 0, y: 0, scale: 1 });
      return;
    }

    // Center the content at 100% scale
    const containerRect = container.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();
    const currentScale = viewport.scale;

    // Calculate content size at scale 1
    const contentWidth = contentRect.width / currentScale;
    const contentHeight = contentRect.height / currentScale;

    setViewport({
      x: (containerRect.width - contentWidth) / 2,
      y: (containerRect.height - contentHeight) / 2,
      scale: 1,
    });
  }, [viewport.scale]);

  // Get cursor style based on current mode
  const getCursor = useCallback(() => {
    if (isPanning) return "grabbing";
    if (isSpacePressed) return "grab";
    return "crosshair";
  }, [isPanning, isSpacePressed]);

  // Handle mouse down on container for panning
  // Returns true if panning was initiated (caller should not start lasso)
  const handleContainerMouseDown = useCallback(
    (e: React.MouseEvent): boolean => {
      // Middle mouse button or space + left click starts panning
      if (e.button === 1 || (isSpacePressed && e.button === 0)) {
        e.preventDefault();
        setIsPanning(true);
        return true;
      }
      return false;
    },
    [isSpacePressed],
  );

  return {
    viewport,
    isPanning,
    isSpacePressed,
    containerRef,
    contentRef,
    handleZoomIn,
    handleZoomOut,
    handleResetZoom,
    getCursor,
    handleContainerMouseDown,
  };
}
