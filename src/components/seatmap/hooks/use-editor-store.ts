'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  EditorElement,
  Tool,
  Viewport,
  DEFAULT_RECT_PROPS,
  DEFAULT_TEXT_PROPS,
  RectElement,
  TextElement,
} from '../utils/types';
import { snapPositionToGrid } from '../utils/snap-to-grid';

const STORAGE_KEY = 'seatmap-editor-state';
const SAVE_DEBOUNCE_MS = 500;

type HistoryState = {
  past: EditorElement[][];
  present: EditorElement[];
  future: EditorElement[][];
};

type EditorStore = {
  // State
  elements: EditorElement[];
  selectedIds: string[];
  activeTool: Tool;
  viewport: Viewport;
  
  // Element actions
  addElement: (type: 'rect' | 'text', x: number, y: number) => void;
  updateElement: (id: string, updates: Partial<EditorElement>) => void;
  deleteSelected: () => void;
  duplicateSelected: () => void;
  selectElement: (id: string, addToSelection?: boolean) => void;
  selectAll: () => void;
  deselectAll: () => void;
  setSelectedIds: (ids: string[]) => void;
  
  // Tool actions
  setActiveTool: (tool: Tool) => void;
  
  // Viewport actions
  setViewport: (viewport: Viewport) => void;
  
  // History actions
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  
  // Persistence
  clearAll: () => void;
};

function generateId(): string {
  return `el_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function loadFromStorage(): EditorElement[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (e) {
    console.warn('Failed to load editor state from localStorage:', e);
  }
  return [];
}

function saveToStorage(elements: EditorElement[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(elements));
  } catch (e) {
    console.warn('Failed to save editor state to localStorage:', e);
  }
}

export function useEditorStore(): EditorStore {
  // History state
  const [history, setHistory] = useState<HistoryState>(() => ({
    past: [],
    present: [],
    future: [],
  }));
  
  // UI state (not part of history)
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [viewport, setViewport] = useState<Viewport>({ x: 0, y: 0, scale: 1 });
  
  // Debounced save ref
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Load from localStorage on mount
  useEffect(() => {
    const loaded = loadFromStorage();
    if (loaded.length > 0) {
      setHistory({ past: [], present: loaded, future: [] });
    }
  }, []);
  
  // Debounced save to localStorage
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveToStorage(history.present);
    }, SAVE_DEBOUNCE_MS);
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [history.present]);
  
  // Helper to push state to history
  const pushToHistory = useCallback((newPresent: EditorElement[]) => {
    setHistory((prev) => ({
      past: [...prev.past, prev.present],
      present: newPresent,
      future: [],
    }));
  }, []);
  
  // Add element
  const addElement = useCallback((type: 'rect' | 'text', x: number, y: number) => {
    const snapped = snapPositionToGrid(x, y);
    const id = generateId();
    
    let newElement: EditorElement;
    if (type === 'rect') {
      newElement = {
        ...DEFAULT_RECT_PROPS,
        id,
        x: snapped.x,
        y: snapped.y,
      } as RectElement;
    } else {
      newElement = {
        ...DEFAULT_TEXT_PROPS,
        id,
        x: snapped.x,
        y: snapped.y,
      } as TextElement;
    }
    
    pushToHistory([...history.present, newElement]);
    setSelectedIds([id]);
    setActiveTool('select');
  }, [history.present, pushToHistory]);
  
  // Update element
  const updateElement = useCallback((id: string, updates: Partial<EditorElement>) => {
    const newElements = history.present.map((el): EditorElement =>
      el.id === id ? ({ ...el, ...updates } as EditorElement) : el
    );
    pushToHistory(newElements);
  }, [history.present, pushToHistory]);
  
  // Delete selected
  const deleteSelected = useCallback(() => {
    if (selectedIds.length === 0) return;
    const newElements = history.present.filter((el) => !selectedIds.includes(el.id));
    pushToHistory(newElements);
    setSelectedIds([]);
  }, [history.present, selectedIds, pushToHistory]);
  
  // Duplicate selected
  const duplicateSelected = useCallback(() => {
    if (selectedIds.length === 0) return;
    
    const toDuplicate = history.present.filter((el) => selectedIds.includes(el.id));
    const duplicated = toDuplicate.map((el) => ({
      ...el,
      id: generateId(),
      x: el.x + 20,
      y: el.y + 20,
    }));
    
    pushToHistory([...history.present, ...duplicated]);
    setSelectedIds(duplicated.map((el) => el.id));
  }, [history.present, selectedIds, pushToHistory]);
  
  // Select element
  const selectElement = useCallback((id: string, addToSelection = false) => {
    if (addToSelection) {
      setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
    } else {
      setSelectedIds([id]);
    }
  }, []);
  
  // Select all
  const selectAll = useCallback(() => {
    setSelectedIds(history.present.map((el) => el.id));
  }, [history.present]);
  
  // Deselect all
  const deselectAll = useCallback(() => {
    setSelectedIds([]);
  }, []);
  
  // Undo
  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.past.length === 0) return prev;
      const newPast = prev.past.slice(0, -1);
      const newPresent = prev.past[prev.past.length - 1];
      return {
        past: newPast,
        present: newPresent,
        future: [prev.present, ...prev.future],
      };
    });
  }, []);
  
  // Redo
  const redo = useCallback(() => {
    setHistory((prev) => {
      if (prev.future.length === 0) return prev;
      const newFuture = prev.future.slice(1);
      const newPresent = prev.future[0];
      return {
        past: [...prev.past, prev.present],
        present: newPresent,
        future: newFuture,
      };
    });
  }, []);
  
  // Clear all
  const clearAll = useCallback(() => {
    pushToHistory([]);
    setSelectedIds([]);
  }, [pushToHistory]);
  
  return {
    elements: history.present,
    selectedIds,
    activeTool,
    viewport,
    
    addElement,
    updateElement,
    deleteSelected,
    duplicateSelected,
    selectElement,
    selectAll,
    deselectAll,
    setSelectedIds,
    
    setActiveTool,
    setViewport,
    
    undo,
    redo,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    
    clearAll,
  };
}

