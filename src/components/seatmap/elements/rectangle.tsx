'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { Rect, Text, Group } from 'react-konva';
import type Konva from 'konva';
import { RectElement, GRID_SIZE } from '../utils/types';
import { snapToGrid } from '../utils/snap-to-grid';

type RectangleProps = {
  element: RectElement;
  isSelected: boolean;
  onSelect: (id: string, addToSelection: boolean) => void;
  onUpdate: (id: string, updates: Partial<RectElement>) => void;
  onDragEnd: () => void;
  stageRef: React.RefObject<Konva.Stage | null>;
};

export function Rectangle({
  element,
  isSelected,
  onSelect,
  onUpdate,
  onDragEnd,
  stageRef,
}: RectangleProps) {
  const groupRef = useRef<Konva.Group>(null);
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target;
    const x = snapToGrid(node.x(), GRID_SIZE);
    const y = snapToGrid(node.y(), GRID_SIZE);
    
    node.position({ x, y });
    onUpdate(element.id, { x, y });
    onDragEnd();
  };

  const handleTransformEnd = (e: Konva.KonvaEventObject<Event>) => {
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    // Calculate new dimensions
    const newWidth = Math.max(GRID_SIZE, Math.round(element.width * scaleX));
    const newHeight = Math.max(GRID_SIZE, Math.round(element.height * scaleY));

    // Reset scale
    node.scaleX(1);
    node.scaleY(1);

    // Update element with new dimensions
    onUpdate(element.id, {
      x: node.x(),
      y: node.y(),
      width: newWidth,
      height: newHeight,
      rotation: node.rotation(),
    });
  };

  const handleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true;
    onSelect(element.id, e.evt.shiftKey);
  };

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  // Handle textarea positioning and lifecycle for label editing
  useEffect(() => {
    if (!isEditing || !stageRef.current || !groupRef.current) return;

    const stage = stageRef.current;
    const group = groupRef.current;
    const container = stage.container();
    const stageBox = container.getBoundingClientRect();
    
    // Get the absolute position of the group
    const groupPosition = group.absolutePosition();
    const scale = stage.scaleX();

    // Create textarea
    const textarea = document.createElement('textarea');
    textareaRef.current = textarea;
    document.body.appendChild(textarea);

    // Calculate center position
    const centerX = groupPosition.x + (element.width * scale) / 2;
    const centerY = groupPosition.y + (element.height * scale) / 2;

    const fontSize = (element.labelFontSize || 14) * scale;
    const textareaWidth = Math.max(60, element.width * scale * 0.8);
    const textareaHeight = Math.max(24, fontSize * 1.5);

    textarea.value = element.label || '';
    textarea.placeholder = 'Enter label...';
    textarea.style.position = 'fixed';
    textarea.style.top = `${stageBox.top + centerY - textareaHeight / 2}px`;
    textarea.style.left = `${stageBox.left + centerX - textareaWidth / 2}px`;
    textarea.style.width = `${textareaWidth}px`;
    textarea.style.height = `${textareaHeight}px`;
    textarea.style.fontSize = `${fontSize}px`;
    textarea.style.fontFamily = 'Outfit, sans-serif';
    textarea.style.color = element.labelColor || '#333333';
    textarea.style.border = '2px solid #3399ff';
    textarea.style.borderRadius = '4px';
    textarea.style.padding = '4px 8px';
    textarea.style.margin = '0';
    textarea.style.overflow = 'hidden';
    textarea.style.background = 'white';
    textarea.style.outline = 'none';
    textarea.style.resize = 'none';
    textarea.style.textAlign = 'center';
    textarea.style.lineHeight = '1.2';
    textarea.style.zIndex = '1000';
    textarea.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';

    textarea.focus();
    textarea.select();

    let isRemoved = false;

    const removeTextarea = () => {
      if (isRemoved) return;
      isRemoved = true;
      
      textarea.removeEventListener('blur', handleBlur);
      textarea.removeEventListener('keydown', handleKeyDown);
      
      if (document.body.contains(textarea)) {
        document.body.removeChild(textarea);
      }
      textareaRef.current = null;
    };

    const finishEditing = () => {
      const newLabel = textarea.value.trim();
      if (newLabel !== (element.label || '')) {
        onUpdate(element.id, { label: newLabel || undefined });
      }
      removeTextarea();
      setIsEditing(false);
    };

    const handleBlur = () => {
      finishEditing();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        finishEditing();
      }
      if (e.key === 'Escape') {
        removeTextarea();
        setIsEditing(false);
      }
    };

    textarea.addEventListener('blur', handleBlur);
    textarea.addEventListener('keydown', handleKeyDown);

    return () => {
      removeTextarea();
    };
  }, [isEditing, element, onUpdate, stageRef]);

  const fontSize = element.labelFontSize || 14;

  return (
    <Group
      ref={groupRef}
      id={element.id}
      x={element.x}
      y={element.y}
      rotation={element.rotation}
      draggable
      onClick={handleClick}
      onTap={handleClick}
      onDblClick={handleDoubleClick}
      onDblTap={handleDoubleClick}
      onDragEnd={handleDragEnd}
      onTransformEnd={handleTransformEnd}
    >
      {/* Rectangle */}
      <Rect
        width={element.width}
        height={element.height}
        fill={element.fill}
        stroke={isSelected ? '#3399ff' : element.stroke}
        strokeWidth={isSelected ? 2 : element.strokeWidth}
        perfectDrawEnabled={false}
      />
      
      {/* Centered Label */}
      {element.label && !isEditing && (
        <Text
          text={element.label}
          fontSize={fontSize}
          fontFamily="Outfit, sans-serif"
          fill={element.labelColor || '#333333'}
          width={element.width}
          height={element.height}
          align="center"
          verticalAlign="middle"
          listening={false}
          perfectDrawEnabled={false}
        />
      )}
    </Group>
  );
}
