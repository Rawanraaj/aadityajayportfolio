'use client';

import { ReactNode, useRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { GripVertical } from 'lucide-react';

interface ReorderableItem {
  id: string;
}

interface ReorderableListProps<T extends ReorderableItem> {
  items: T[];
  onReorder: (items: T[]) => void;
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor?: (item: T) => string;
  className?: string;
}

export function ReorderableList<T extends ReorderableItem>({
  items,
  onReorder,
  renderItem,
  keyExtractor = (i) => i.id,
  className,
}: ReorderableListProps<T>) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const dragIdRef = useRef<string | null>(null);

  const handleDragStart = useCallback((index: number) => {
    setDragIndex(index);
    dragIdRef.current = keyExtractor(items[index]);
  }, [items, keyExtractor]);

  const handleDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      if (dragIndex === null) return;
      if (overIndex !== index) setOverIndex(index);
    },
    [dragIndex, overIndex]
  );

  const handleDrop = useCallback(
    (index: number) => {
      if (dragIndex === null || dragIndex === index) {
        setDragIndex(null);
        setOverIndex(null);
        return;
      }
      const next = [...items];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(index, 0, moved);
      onReorder(next);
      setDragIndex(null);
      setOverIndex(null);
    },
    [items, dragIndex, onReorder]
  );

  const handleDragEnd = useCallback(() => {
    setDragIndex(null);
    setOverIndex(null);
  }, []);

  // Touch / pointer-based reordering fallback via buttons handled by parent
  return (
    <div className={cn('space-y-2', className)}>
      {items.map((item, index) => {
        const key = keyExtractor(item);
        const isDragging = dragIndex === index;
        const isOver = overIndex === index && dragIndex !== index;
        return (
          <div
            key={key}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={() => handleDrop(index)}
            onDragEnd={handleDragEnd}
            className={cn(
              'transition-all',
              isDragging && 'opacity-40',
              isOver && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
            )}
          >
            <div className="flex items-start gap-2">
              <div className="pt-3 pl-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
                <GripVertical className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">{renderItem(item, index)}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
