import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ColumnDto } from "@/types/column.types";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripHorizontal } from "lucide-react";
import { CreateTaskModal } from "./CreateTaskModal";
import { TaskCard } from "./TaskCard";

interface KanbanColumnProps {
  column: ColumnDto;
  isOverlay?: boolean;
}

export function KanbanColumn({ column, isOverlay }: KanbanColumnProps) {
  const taskIds = column.tasks.map((task) => task.id);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    disabled: isOverlay ?? false,
    data: {
      type: "Column",
      column,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  if (isOverlay) {
    return (
      <div className="flex flex-col bg-muted/80 rounded-xl w-80 min-w-80 max-h-full border-2 border-primary shadow-2xl rotate-2">
        <div className="p-3 flex items-center justify-between border-b bg-muted/50 rounded-t-xl">
          <h3 className="font-semibold text-sm">{column.name}</h3>
          <Badge variant="secondary" className="bg-background">
            {column.tasks.length}
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-col bg-muted/50 rounded-xl w-80 min-w-80 max-h-full border shrink-0"
    >
      <div
        {...attributes}
        {...listeners}
        className="p-3 flex items-center justify-between border-b bg-muted/30 rounded-t-xl cursor-grab active:cursor-grabbing group hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <GripHorizontal className="h-4 w-4 text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity" />
          <h3 className="font-semibold text-sm">{column.name}</h3>
        </div>
        <Badge variant="secondary" className="bg-background">
          {column.tasks.length}
        </Badge>
      </div>

      <ScrollArea className="flex-1 p-3">
        <div className="flex flex-col gap-3 pb-2 min-h-[50px]">
          <SortableContext
            items={taskIds}
            strategy={verticalListSortingStrategy}
          >
            {column.tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </SortableContext>
        </div>
        <CreateTaskModal columnId={column.id} />
      </ScrollArea>
    </div>
  );
}
