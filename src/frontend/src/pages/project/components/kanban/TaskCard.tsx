import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDateWithoutTime } from "@/lib/utils";
import { type TaskItemDto, TaskPriority } from "@/types/taskItem.types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Calendar, GripVertical } from "lucide-react";
import { useTranslation } from "react-i18next";

interface TaskCardProps {
  task: TaskItemDto;
}

export function TaskCard({ task }: TaskCardProps) {
  const { t } = useTranslation();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case TaskPriority.Low:
        return "bg-blue-500/10 text-blue-500";
      case TaskPriority.Medium:
        return "bg-yellow-500/10 text-yellow-600";
      case TaskPriority.High:
        return "bg-orange-500/10 text-orange-600";
      case TaskPriority.Critical:
        return "bg-red-500/10 text-red-600";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  const getPriorityText = (priority: number) => {
    const key = Object.keys(TaskPriority).find(
      (k) => TaskPriority[k as keyof typeof TaskPriority] === priority,
    );
    return key ? t(`task.priority.${key.toLowerCase()}`, key) : "Unknown";
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`hover:ring-1 hover:ring-primary/50 transition-all ${isDragging ? "ring-2 ring-primary shadow-lg cursor-grabbing" : ""}`}
    >
      <CardHeader className="p-3 pb-0 flex flex-row items-start justify-between space-y-0">
        <div className="font-medium text-sm leading-tight line-clamp-2">
          {task.title}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5 -mr-1 -mt-1 text-muted-foreground cursor-grab hover:bg-muted"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-3 pt-2 flex flex-col gap-2">
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-1">
          <Badge
            variant="secondary"
            className={`text-[10px] px-1.5 py-0 border-none ${getPriorityColor(task.priority)}`}
          >
            {getPriorityText(task.priority)}
          </Badge>

          {task.dueDate && (
            <div className="flex items-center text-[10px] text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              {formatDateWithoutTime(task.dueDate)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
