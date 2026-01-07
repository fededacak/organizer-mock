'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { Text, Group } from 'react-konva';
import type Konva from 'konva';
import { TextElement as TextElementType, GRID_SIZE } from '../utils/types';
import { snapToGrid } from '../utils/snap-to-grid';

type TextElementProps = {
  element: TextElementType;
  isSelected: boolean;
  onSelect: (id: string, addToSelection: boolean) => void;
  onUpdate: (id: string, updates: Partial<TextElementType>) => void;
  onDragEnd: () => void;
  stageRef: React.RefObject<Konva.Stage | null>;
};

export function TextElement({
  element,
  isSelected,
  onSelect,
  onUpdate,
  onDragEnd,
  stageRef,
}: TextElementProps) {
  const textRef = useRef<Konva.Text>(null);
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

  const handleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true;
    onSelect(element.id, e.evt.shiftKey);
  };

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  // Handle textarea positioning and lifecycle
  useEffect(() => {
    if (!isEditing || !stageRef.current || !textRef.current) return;

    const stage = stageRef.current;
    const textNode = textRef.current;
    const container = stage.container();
    const stageBox = container.getBoundingClientRect();
    
    // Get the absolute position of the text node
    const textPosition = textNode.absolutePosition();
    const scale = stage.scaleX();

    // Create textarea
    const textarea = document.createElement('textarea');
    textareaRef.current = textarea;
    document.body.appendChild(textarea);

    const areaPosition = {
      x: stageBox.left + textPosition.x * scale,
      y: stageBox.top + textPosition.y * scale,
    };

    textarea.value = element.text;
    textarea.style.position = 'fixed';
    textarea.style.top = `${areaPosition.y}px`;
    textarea.style.left = `${areaPosition.x}px`;
    textarea.style.width = `${Math.max(100, (textNode.width() + 20) * scale)}px`;
    textarea.style.height = `${Math.max(24, (textNode.height() + 10) * scale)}px`;
    textarea.style.fontSize = `${element.fontSize * scale}px`;
    textarea.style.fontFamily = element.fontFamily;
    textarea.style.color = element.fill;
    textarea.style.border = '2px solid #3399ff';
    textarea.style.borderRadius = '4px';
    textarea.style.padding = '4px';
    textarea.style.margin = '0';
    textarea.style.overflow = 'hidden';
    textarea.style.background = 'white';
    textarea.style.outline = 'none';
    textarea.style.resize = 'none';
    textarea.style.lineHeight = '1.2';
    textarea.style.zIndex = '1000';
    textarea.style.transformOrigin = 'top left';

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
      const newText = textarea.value;
      if (newText !== element.text) {
        onUpdate(element.id, { text: newText });
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

  return (
    <Group
      x={element.x}
      y={element.y}
      rotation={element.rotation}
      draggable
      onClick={handleClick}
      onTap={handleClick}
      onDblClick={handleDoubleClick}
      onDblTap={handleDoubleClick}
      onDragEnd={handleDragEnd}
    >
      <Text
        ref={textRef}
        id={element.id}
        x={0}
        y={0}
        text={element.text}
        fontSize={element.fontSize}
        fontFamily={element.fontFamily}
        fill={element.fill}
        visible={!isEditing}
        perfectDrawEnabled={false}
      />
      {/* Selection indicator */}
      {isSelected && !isEditing && textRef.current && (
        <></>
      )}
    </Group>
  );
}

