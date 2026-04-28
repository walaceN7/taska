import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDateWithoutTime } from "@/lib/utils";
import type { TaskItemDto } from "@/types/taskItem.types";
import { TaskPriority } from "@/types/taskItem.types";
import { Calendar, GripVertical } from "lucide-react";
import { useTranslation } from "react-i18next";

interface TaskCardProps {
  task: TaskItemDto;
}

export function TaskCard({ task }: TaskCardProps) {
  const { t } = useTranslation();

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case TaskPriority.Low:
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
      case TaskPriority.Medium:
        return "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20";
      case TaskPriority.High:
        return "bg-orange-500/10 text-orange-600 hover:bg-orange-500/20";
      case TaskPriority.Critical:
        return "bg-red-500/10 text-red-600 hover:bg-red-500/20";
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
    <Card className="cursor-grab active:cursor-grabbing hover:ring-1 hover:ring-primary/50 transition-all">
      <CardHeader className="p-3 pb-0 flex flex-row items-start justify-between space-y-0">
        <div className="font-medium text-sm leading-tight line-clamp-2">
          {task.title}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5 -mr-1 -mt-1 text-muted-foreground cursor-grab"
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
