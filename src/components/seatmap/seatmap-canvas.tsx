'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { Stage, Layer, Rect, Transformer, Line } from 'react-konva';
import type Konva from 'konva';
import {
  EditorElement,
  Tool,
  Viewport,
  GRID_SIZE,
  MIN_SCALE,
  MAX_SCALE,
  RectElement,
  TextElement as TextElementType,
} from './utils/types';
import { Rectangle } from './elements/rectangle';
import { TextElement } from './elements/text-element';

type SeatmapCanvasProps = {
  elements: EditorElement[];
  selectedIds: string[];
  activeTool: Tool;
  viewport: Viewport;
  onAddElement: (type: 'rect' | 'text', x: number, y: number) => void;
  onUpdateElement: (id: string, updates: Partial<EditorElement>) => void;
  onSelectElement: (id: string, addToSelection: boolean) => void;
  onSetSelectedIds: (ids: string[]) => void;
  onDeselectAll: () => void;
  onSetViewport: (viewport: Viewport) => void;
  stageRef: React.RefObject<Konva.Stage | null>;
};

export function SeatmapCanvas({
  elements,
  selectedIds,
  activeTool,
  viewport,
  onAddElement,
  onUpdateElement,
  onSelectElement,
  onSetSelectedIds,
  onDeselectAll,
  onSetViewport,
  stageRef,
}: SeatmapCanvasProps) {
  const transformerRef = useRef<Konva.Transformer>(null);
  const layerRef = useRef<Konva.Layer>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  
  // Selection box state
  const [selectionBox, setSelectionBox] = useState<{
    visible: boolean;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  } | null>(null);

  // Handle window resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setStageSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Update transformer when selection changes
  useEffect(() => {
    if (!transformerRef.current || !layerRef.current) return;

    const stage = stageRef.current;
    if (!stage) return;

    const selectedNodes = selectedIds
      .map((id) => stage.findOne(`#${id}`))
      .filter((node): node is Konva.Node => node !== undefined);

    transformerRef.current.nodes(selectedNodes);
    layerRef.current.batchDraw();
  }, [selectedIds, elements, stageRef]);

  // Handle space key for panning
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        setIsSpacePressed(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
        setIsPanning(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Handle wheel zoom
  const handleWheel = useCallback(
    (e: Konva.KonvaEventObject<WheelEvent>) => {
      e.evt.preventDefault();

      const stage = stageRef.current;
      if (!stage) return;

      const oldScale = viewport.scale;
      const pointer = stage.getPointerPosition();
      if (!pointer) return;

      const mousePointTo = {
        x: (pointer.x - viewport.x) / oldScale,
        y: (pointer.y - viewport.y) / oldScale,
      };

      const direction = e.evt.deltaY > 0 ? -1 : 1;
      const scaleBy = 1.1;
      let newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
      newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));

      const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };

      onSetViewport({
        x: newPos.x,
        y: newPos.y,
        scale: newScale,
      });
    },
    [viewport, onSetViewport, stageRef]
  );

  // Handle stage click
  const handleStageClick = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      // Check if we clicked on the stage itself (empty area)
      if (e.target !== e.target.getStage()) return;

      const stage = stageRef.current;
      if (!stage) return;

      const pointer = stage.getPointerPosition();
      if (!pointer) return;

      // Transform pointer to stage coordinates
      const stagePos = {
        x: (pointer.x - viewport.x) / viewport.scale,
        y: (pointer.y - viewport.y) / viewport.scale,
      };

      if (activeTool === 'rect') {
        onAddElement('rect', stagePos.x, stagePos.y);
      } else if (activeTool === 'text') {
        onAddElement('text', stagePos.x, stagePos.y);
      } else {
        onDeselectAll();
      }
    },
    [activeTool, viewport, onAddElement, onDeselectAll, stageRef]
  );

  // Handle panning
  const handleMouseDown = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      // Middle mouse button or space + left click for panning
      if (e.evt.button === 1 || (isSpacePressed && e.evt.button === 0)) {
        setIsPanning(true);
        e.evt.preventDefault();
        return;
      }

      // Start selection box if clicking on empty space with select tool
      if (
        activeTool === 'select' &&
        e.target === e.target.getStage() &&
        e.evt.button === 0 &&
        !isSpacePressed
      ) {
        const stage = stageRef.current;
        if (!stage) return;

        const pointer = stage.getPointerPosition();
        if (!pointer) return;

        const stagePos = {
          x: (pointer.x - viewport.x) / viewport.scale,
          y: (pointer.y - viewport.y) / viewport.scale,
        };

        setSelectionBox({
          visible: true,
          x1: stagePos.x,
          y1: stagePos.y,
          x2: stagePos.x,
          y2: stagePos.y,
        });
      }
    },
    [isSpacePressed, activeTool, viewport, stageRef]
  );

  const handleMouseMove = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      const stage = stageRef.current;
      if (!stage) return;

      // Handle panning
      if (isPanning) {
        const dx = e.evt.movementX;
        const dy = e.evt.movementY;
        onSetViewport({
          ...viewport,
          x: viewport.x + dx,
          y: viewport.y + dy,
        });
        return;
      }

      // Handle selection box
      if (selectionBox?.visible) {
        const pointer = stage.getPointerPosition();
        if (!pointer) return;

        const stagePos = {
          x: (pointer.x - viewport.x) / viewport.scale,
          y: (pointer.y - viewport.y) / viewport.scale,
        };

        setSelectionBox({
          ...selectionBox,
          x2: stagePos.x,
          y2: stagePos.y,
        });
      }
    },
    [isPanning, selectionBox, viewport, onSetViewport, stageRef]
  );

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);

    // Finish selection box
    if (selectionBox?.visible) {
      const box = {
        x: Math.min(selectionBox.x1, selectionBox.x2),
        y: Math.min(selectionBox.y1, selectionBox.y2),
        width: Math.abs(selectionBox.x2 - selectionBox.x1),
        height: Math.abs(selectionBox.y2 - selectionBox.y1),
      };

      // Only select if the box has some size
      if (box.width > 5 && box.height > 5) {
        const selectedElements = elements.filter((el) => {
          const elWidth = el.type === 'rect' ? el.width : 100;
          const elHeight = el.type === 'rect' ? el.height : 20;

          return (
            el.x < box.x + box.width &&
            el.x + elWidth > box.x &&
            el.y < box.y + box.height &&
            el.y + elHeight > box.y
          );
        });

        onSetSelectedIds(selectedElements.map((el) => el.id));
      }

      setSelectionBox(null);
    }
  }, [selectionBox, elements, onSetSelectedIds]);

  // Handle transformer transform end (resize) - only for text elements
  // Rectangle elements handle their own transform via onTransformEnd
  const handleTransformEnd = useCallback(() => {
    const transformer = transformerRef.current;
    if (!transformer) return;

    const nodes = transformer.nodes();
    nodes.forEach((node) => {
      const id = node.id();
      const element = elements.find((el) => el.id === id);
      if (!element) return;

      // Only handle text elements here - rectangles handle their own transform
      if (element.type === 'text') {
        onUpdateElement(id, {
          x: node.x(),
          y: node.y(),
          rotation: node.rotation(),
        });
      }
    });
  }, [elements, onUpdateElement]);

  // Generate grid lines
  const renderGrid = () => {
    const lines: React.ReactNode[] = [];
    const gridSize = GRID_SIZE;

    // Calculate visible area in stage coordinates
    const startX = Math.floor(-viewport.x / viewport.scale / gridSize) * gridSize - gridSize;
    const endX = Math.ceil((stageSize.width - viewport.x) / viewport.scale / gridSize) * gridSize + gridSize;
    const startY = Math.floor(-viewport.y / viewport.scale / gridSize) * gridSize - gridSize;
    const endY = Math.ceil((stageSize.height - viewport.y) / viewport.scale / gridSize) * gridSize + gridSize;

    // Vertical lines
    for (let x = startX; x <= endX; x += gridSize) {
      lines.push(
        <Line
          key={`v-${x}`}
          points={[x, startY, x, endY]}
          stroke="#e0e0e0"
          strokeWidth={0.5 / viewport.scale}
          listening={false}
        />
      );
    }

    // Horizontal lines
    for (let y = startY; y <= endY; y += gridSize) {
      lines.push(
        <Line
          key={`h-${y}`}
          points={[startX, y, endX, y]}
          stroke="#e0e0e0"
          strokeWidth={0.5 / viewport.scale}
          listening={false}
        />
      );
    }

    return lines;
  };

  // Render selection box
  const renderSelectionBox = () => {
    if (!selectionBox?.visible) return null;

    const x = Math.min(selectionBox.x1, selectionBox.x2);
    const y = Math.min(selectionBox.y1, selectionBox.y2);
    const width = Math.abs(selectionBox.x2 - selectionBox.x1);
    const height = Math.abs(selectionBox.y2 - selectionBox.y1);

    return (
      <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="rgba(51, 153, 255, 0.1)"
        stroke="#3399ff"
        strokeWidth={1 / viewport.scale}
        listening={false}
      />
    );
  };

  const getCursor = () => {
    if (isPanning || isSpacePressed) return 'grab';
    if (activeTool === 'rect' || activeTool === 'text') return 'crosshair';
    return 'default';
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 bg-[#f6f7fa] overflow-hidden"
      style={{ cursor: getCursor() }}
    >
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        x={viewport.x}
        y={viewport.y}
        scaleX={viewport.scale}
        scaleY={viewport.scale}
        onWheel={handleWheel}
        onClick={handleStageClick}
        onTap={handleStageClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <Layer ref={layerRef}>
          {/* Grid */}
          {renderGrid()}

          {/* Elements */}
          {elements.map((element) => {
            if (element.type === 'rect') {
              return (
                <Rectangle
                  key={element.id}
                  element={element as RectElement}
                  isSelected={selectedIds.includes(element.id)}
                  onSelect={onSelectElement}
                  onUpdate={onUpdateElement}
                  onDragEnd={() => {}}
                  stageRef={stageRef}
                />
              );
            }
            if (element.type === 'text') {
              return (
                <TextElement
                  key={element.id}
                  element={element as TextElementType}
                  isSelected={selectedIds.includes(element.id)}
                  onSelect={onSelectElement}
                  onUpdate={onUpdateElement}
                  onDragEnd={() => {}}
                  stageRef={stageRef}
                />
              );
            }
            return null;
          })}

          {/* Selection box */}
          {renderSelectionBox()}

          {/* Transformer */}
          <Transformer
            ref={transformerRef}
            rotateEnabled={true}
            enabledAnchors={[
              'top-left',
              'top-right',
              'bottom-left',
              'bottom-right',
              'middle-left',
              'middle-right',
              'top-center',
              'bottom-center',
            ]}
            boundBoxFunc={(oldBox, newBox) => {
              // Limit minimum size
              if (newBox.width < GRID_SIZE || newBox.height < GRID_SIZE) {
                return oldBox;
              }
              return newBox;
            }}
            onTransformEnd={handleTransformEnd}
            anchorFill="#fff"
            anchorStroke="#3399ff"
            anchorSize={8}
            borderStroke="#3399ff"
            borderStrokeWidth={1}
          />
        </Layer>
      </Stage>
    </div>
  );
}

