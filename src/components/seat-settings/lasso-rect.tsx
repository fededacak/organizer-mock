"use client";

interface LassoRectProps {
  start: { x: number; y: number };
  end: { x: number; y: number };
}

/**
 * Lasso selection rectangle overlay
 * Renders a visual rectangle during drag-to-select operations
 */
export function LassoRect({ start, end }: LassoRectProps) {
  const left = Math.min(start.x, end.x);
  const top = Math.min(start.y, end.y);
  const width = Math.abs(end.x - start.x);
  const height = Math.abs(end.y - start.y);

  return (
    <div
      className="fixed pointer-events-none border-2 border-tp-blue bg-tp-blue/10 rounded-[2px] z-50"
      style={{
        left,
        top,
        width,
        height,
      }}
    />
  );
}
