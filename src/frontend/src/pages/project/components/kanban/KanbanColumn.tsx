import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ColumnDto } from "@/types/column.types";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CreateTaskModal } from "./CreateTaskModal";
import { TaskCard } from "./TaskCard";

interface KanbanColumnProps {
  column: ColumnDto;
}

export function KanbanColumn({ column }: KanbanColumnProps) {
  const taskIds = column.tasks.map((task) => task.id);

  const { setNodeRef } = useDroppable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className="flex flex-col bg-muted/50 rounded-xl w-80 min-w-80 max-h-full border"
    >
      <div className="p-3 flex items-center justify-between border-b bg-muted/30 rounded-t-xl">
        <h3 className="font-semibold text-sm">{column.name}</h3>
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
