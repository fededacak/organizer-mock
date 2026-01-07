"use client";

import { useEffect, useRef, useCallback } from "react";
import type Konva from "konva";
import { useEditorStore } from "./hooks/use-editor-store";
import { SeatmapCanvas } from "./seatmap-canvas";
import { SeatmapToolbar } from "./seatmap-toolbar";
// Header with leave confirmation modal
import { SeatmapHeader } from "./seatmap-header";
import { downloadSVG } from "./utils/export-svg";

export function SeatmapEditor() {
  const stageRef = useRef<Konva.Stage | null>(null);

  const {
    elements,
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
    canUndo,
    canRedo,
    clearAll,
  } = useEditorStore();

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't handle shortcuts when typing in input fields
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const cmdKey = isMac ? e.metaKey : e.ctrlKey;

      // Delete
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedIds.length > 0) {
          e.preventDefault();
          deleteSelected();
        }
      }

      // Duplicate (Cmd/Ctrl + D)
      if (cmdKey && e.key === "d") {
        if (selectedIds.length > 0) {
          e.preventDefault();
          duplicateSelected();
        }
      }

      // Undo (Cmd/Ctrl + Z)
      if (cmdKey && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      // Redo (Cmd/Ctrl + Shift + Z)
      if (cmdKey && e.key === "z" && e.shiftKey) {
        e.preventDefault();
        redo();
      }

      // Select All (Cmd/Ctrl + A)
      if (cmdKey && e.key === "a") {
        e.preventDefault();
        selectAll();
      }

      // Escape - deselect or reset tool
      if (e.key === "Escape") {
        if (selectedIds.length > 0) {
          deselectAll();
        } else if (activeTool !== "select") {
          setActiveTool("select");
        }
      }

      // Tool shortcuts
      if (!cmdKey && !e.altKey) {
        if (e.key === "v" || e.key === "V") {
          setActiveTool("select");
        }
        if (e.key === "r" || e.key === "R") {
          setActiveTool("rect");
        }
        if (e.key === "t" || e.key === "T") {
          setActiveTool("text");
        }
      }
    },
    [
      selectedIds,
      activeTool,
      deleteSelected,
      duplicateSelected,
      undo,
      redo,
      selectAll,
      deselectAll,
      setActiveTool,
    ]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleExport = useCallback(() => {
    downloadSVG(elements);
  }, [elements]);

  return (
    <div className="min-h-screen bg-light-gray">
      {/* Main Content Card */}
      <div className="bg-white shadow-card min-h-screen md:h-full md:flex md:flex-col md:overflow-hidden">
        <SeatmapHeader
          onExport={handleExport}
          onUndo={undo}
          onRedo={redo}
          onClear={clearAll}
          canUndo={canUndo}
          canRedo={canRedo}
          hasElements={elements.length > 0}
        />

        <div className="relative flex-1 md:min-h-0 h-[calc(100vh-56px)] md:h-auto">
          <SeatmapCanvas
            elements={elements}
            selectedIds={selectedIds}
            activeTool={activeTool}
            viewport={viewport}
            onAddElement={addElement}
            onUpdateElement={updateElement}
            onSelectElement={selectElement}
            onSetSelectedIds={setSelectedIds}
            onDeselectAll={deselectAll}
            onSetViewport={setViewport}
            stageRef={stageRef}
          />

          <SeatmapToolbar
            activeTool={activeTool}
            onSetActiveTool={setActiveTool}
          />

          {/* Help text */}
          <div className="absolute bottom-4 right-4 z-10">
            <div className="rounded-xl bg-white/90 backdrop-blur-sm px-3 py-2 shadow-sm border border-light-gray">
              <p className="text-xs text-dark-gray">
                <span className="font-medium">Space + Drag</span> to pan •{" "}
                <span className="font-medium">Scroll</span> to zoom •{" "}
                <span className="font-medium">⌘D</span> duplicate •{" "}
                <span className="font-medium">⌘Z</span> undo
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
