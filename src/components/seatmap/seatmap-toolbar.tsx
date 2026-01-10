'use client';

import { MousePointer2, Square, Type } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tool } from './utils/types';

type SeatmapToolbarProps = {
  activeTool: Tool;
  onSetActiveTool: (tool: Tool) => void;
};

const tools: { id: Tool; icon: React.ReactNode; label: string }[] = [
  {
    id: 'select',
    icon: <MousePointer2 className="size-5" />,
    label: 'Select (V)',
  },
  {
    id: 'rect',
    icon: <Square className="size-5" />,
    label: 'Rectangle (R)',
  },
  {
    id: 'text',
    icon: <Type className="size-5" />,
    label: 'Text (T)',
  },
];

export function SeatmapToolbar({ activeTool, onSetActiveTool }: SeatmapToolbarProps) {
  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
      <div className="flex flex-col gap-1 rounded-xl bg-white p-1.5 shadow-lg border border-border">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onSetActiveTool(tool.id)}
            className={cn(
              'flex items-center justify-center size-10 rounded-lg transition-colors duration-200 ease',
              activeTool === tool.id
                ? 'bg-tp-blue text-white'
                : 'text-dark-gray hover:bg-light-gray'
            )}
            title={tool.label}
          >
            {tool.icon}
          </button>
        ))}
      </div>
    </div>
  );
}


