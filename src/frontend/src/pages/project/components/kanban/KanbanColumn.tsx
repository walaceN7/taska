import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ColumnDto } from "@/types/column.types";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TaskCard } from "./TaskCard";

interface KanbanColumnProps {
  column: ColumnDto;
}

export function KanbanColumn({ column }: KanbanColumnProps) {
  const taskIds = column.tasks.map((task) => task.id);

  return (
    <div className="flex flex-col bg-muted/50 rounded-xl w-80 min-w-80 max-h-full border">
      <div className="p-3 flex items-center justify-between border-b bg-muted/30 rounded-t-xl">
        <h3 className="font-semibold text-sm">{column.name}</h3>
        <Badge variant="secondary" className="bg-background">
          {column.tasks.length}
        </Badge>
      </div>

      <ScrollArea className="flex-1 p-3">
        <div className="flex flex-col gap-3 pb-4 min-h-[100px]">
          <SortableContext
            items={taskIds}
            strategy={verticalListSortingStrategy}
          >
            {column.tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </SortableContext>

          {column.tasks.length === 0 && (
            <div className="text-xs text-center text-muted-foreground py-4 border-2 border-dashed rounded-lg">
              Arraste tarefas para cá
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
