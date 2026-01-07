import { GRID_SIZE } from './types';

/**
 * Snaps a value to the nearest grid point
 */
export function snapToGrid(value: number, gridSize: number = GRID_SIZE): number {
  return Math.round(value / gridSize) * gridSize;
}

/**
 * Snaps position coordinates to grid
 */
export function snapPositionToGrid(
  x: number,
  y: number,
  gridSize: number = GRID_SIZE
): { x: number; y: number } {
  return {
    x: snapToGrid(x, gridSize),
    y: snapToGrid(y, gridSize),
  };
}

/**
 * Snaps size values to grid (minimum 1 grid unit)
 */
export function snapSizeToGrid(
  width: number,
  height: number,
  gridSize: number = GRID_SIZE
): { width: number; height: number } {
  return {
    width: Math.max(gridSize, snapToGrid(width, gridSize)),
    height: Math.max(gridSize, snapToGrid(height, gridSize)),
  };
}

