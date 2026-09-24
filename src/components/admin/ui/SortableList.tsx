"use client";

import { useId } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A list whose rows can be dragged into a new order — with the mouse, touch,
 * or the keyboard (focus the handle, Space to pick up, arrows to move, Space
 * to drop). Works with react-hook-form's useFieldArray (pass its `move`) or
 * any array (move the item yourself in onMove).
 *
 *   <SortableList ids={fields.map((f) => f.id)} onMove={move} label="steps">
 *     {(index, handle) => <Row handle={handle} … />}
 *   </SortableList>
 */
export default function SortableList({
  ids,
  onMove,
  label,
  children,
}: {
  /** One stable id per row, in the current order. */
  ids: string[];
  onMove: (from: number, to: number) => void;
  /** What the rows are, for screen reader announcements, e.g. "steps". */
  label: string;
  /** Renders row `index`; put `handle` where the drag handle should go. */
  children: (index: number, handle: React.ReactNode) => React.ReactNode;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const from = ids.indexOf(String(active.id));
    const to = ids.indexOf(String(over.id));
    if (from >= 0 && to >= 0) onMove(from, to);
  };

  const position = (id: string | number) => ids.indexOf(String(id)) + 1;
  // A stable id, so the ARIA ids dnd-kit generates match between the server
  // render and the browser (its own counter differs → hydration mismatch).
  const contextId = useId();

  return (
    <DndContext
      id={contextId}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
      accessibility={{
        announcements: {
          onDragStart: ({ active }) => `Picked up item ${position(active.id)} of ${ids.length} ${label}.`,
          onDragOver: ({ over }) => (over ? `Moved to position ${position(over.id)}.` : "Not over a position."),
          onDragEnd: ({ over }) => (over ? `Dropped at position ${position(over.id)}.` : "Dropped."),
          onDragCancel: () => "Move cancelled.",
        },
      }}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {ids.map((id, index) => (
            <SortableRow key={id} id={id} index={index} total={ids.length} label={label}>
              {(handle) => children(index, handle)}
            </SortableRow>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableRow({
  id,
  index,
  total,
  label,
  children,
}: {
  id: string;
  index: number;
  total: number;
  label: string;
  children: (handle: React.ReactNode) => React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id });

  const handle = (
    <button
      type="button"
      ref={setActivatorNodeRef}
      {...attributes}
      {...listeners}
      aria-label={`Drag to reorder (item ${index + 1} of ${total} ${label})`}
      className="flex h-8 w-6 shrink-0 cursor-grab touch-none items-center justify-center rounded text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 focus-visible:outline-2 focus-visible:outline-primary-500 active:cursor-grabbing"
    >
      <GripVertical size={16} aria-hidden />
    </button>
  );

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn("relative", isDragging && "z-10 opacity-80 shadow-lg")}
    >
      {children(handle)}
    </div>
  );
}
