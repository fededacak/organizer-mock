// Element Types
export type ElementBase = {
  id: string;
  x: number;
  y: number;
  rotation: number;
};

export type RectElement = ElementBase & {
  type: 'rect';
  width: number;
  height: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  label?: string;
  labelFontSize?: number;
  labelColor?: string;
};

export type TextElement = ElementBase & {
  type: 'text';
  text: string;
  fontSize: number;
  fontFamily: string;
  fill: string;
  width?: number;
  height?: number;
};

export type EditorElement = RectElement | TextElement;

// Viewport state for pan/zoom
export type Viewport = {
  x: number;
  y: number;
  scale: number;
};

// Active tool types
export type Tool = 'select' | 'rect' | 'text';

// Editor state
export type EditorState = {
  elements: EditorElement[];
  selectedIds: string[];
  activeTool: Tool;
  viewport: Viewport;
};

// History state for undo/redo
export type HistoryState = {
  past: EditorElement[][];
  present: EditorElement[];
  future: EditorElement[][];
};

// Bounds for SVG export
export type Bounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

// Default element properties
export const DEFAULT_RECT_PROPS: Omit<RectElement, 'id' | 'x' | 'y'> = {
  type: 'rect',
  width: 100,
  height: 60,
  fill: '#e5e5e5',
  stroke: '#333333',
  strokeWidth: 1,
  rotation: 0,
  labelFontSize: 14,
  labelColor: '#333333',
};

export const DEFAULT_TEXT_PROPS: Omit<TextElement, 'id' | 'x' | 'y'> = {
  type: 'text',
  text: 'Text',
  fontSize: 16,
  fontFamily: 'Outfit, sans-serif',
  fill: '#333333',
  rotation: 0,
};

// Grid configuration
export const GRID_SIZE = 10;
export const MIN_SCALE = 0.1;
export const MAX_SCALE = 5;

