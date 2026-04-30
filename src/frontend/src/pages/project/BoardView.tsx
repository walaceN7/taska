import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useBoard, useColumnsBoard } from "@/hooks/useBoard";
import { BoardType } from "@/types/board.types";
import type { ColumnDto } from "@/types/column.types";
import type { TaskItemDto } from "@/types/taskItem.types";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { CreateColumnButton } from "./components/kanban/CreateColumnButton";
import { KanbanColumn } from "./components/kanban/KanbanColumn";
import { TaskCard } from "./components/kanban/TaskCard";

export function BoardView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { projectId, boardId } = useParams<{
    projectId: string;
    boardId: string;
  }>();

  const { data: board, isLoading } = useBoard(boardId!);
  const { data: columns, isLoading: isColumnsLoading } = useColumnsBoard(
    boardId!,
  );

  const [localColumns, setLocalColumns] = useState<ColumnDto[]>([]);
  const [prevColumns, setPrevColumns] = useState<ColumnDto[] | undefined>(
    undefined,
  );
  const [activeTask, setActiveTask] = useState<TaskItemDto | null>(null);

  if (columns !== prevColumns) {
    setPrevColumns(columns);
    if (columns) {
      setLocalColumns(columns);
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  const findColumn = (uniqueId: string) => {
    if (localColumns.find((c) => c.id === uniqueId)) {
      return localColumns.find((c) => c.id === uniqueId);
    }
    return localColumns.find((c) => c.tasks.find((t) => t.id === uniqueId));
  };

  const handleDragStart = (event: DragStartEvent) => {
    const id = String(event.active.id);
    const column = findColumn(id);
    if (column) {
      const task = column.tasks.find((t) => t.id === id);
      if (task) setActiveTask(task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId === overId) return;

    const activeColumn = findColumn(activeId);
    const overColumn = findColumn(overId);

    if (!activeColumn || !overColumn) return;

    if (activeColumn.id !== overColumn.id) {
      setLocalColumns((prev) => {
        const activeColIndex = prev.findIndex((c) => c.id === activeColumn.id);
        const overColIndex = prev.findIndex((c) => c.id === overColumn.id);

        const activeTasks = [...prev[activeColIndex].tasks];
        const overTasks = [...prev[overColIndex].tasks];

        const activeIndex = activeTasks.findIndex((t) => t.id === activeId);
        const overIndex = overTasks.findIndex((t) => t.id === overId);

        const [movedTask] = activeTasks.splice(activeIndex, 1);
        const taskToInsert = { ...movedTask, columnId: overColumn.id };

        let newIndex: number;
        if (overId === overColumn.id) {
          newIndex = overTasks.length;
        } else {
          const isBelowOverItem =
            active.rect.current.translated &&
            active.rect.current.translated.top >
              over.rect.top + over.rect.height;
          const modifier = isBelowOverItem ? 1 : 0;
          newIndex = overIndex >= 0 ? overIndex + modifier : overTasks.length;
        }

        overTasks.splice(newIndex, 0, taskToInsert);

        const newColumns = [...prev];
        newColumns[activeColIndex] = {
          ...newColumns[activeColIndex],
          tasks: activeTasks,
        };
        newColumns[overColIndex] = {
          ...newColumns[overColIndex],
          tasks: overTasks,
        };

        return newColumns;
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const activeColumn = findColumn(activeId);
    const overColumn = findColumn(overId);

    if (!activeColumn || !overColumn) return;

    if (activeColumn.id === overColumn.id) {
      setLocalColumns((prev) => {
        const colIndex = prev.findIndex((c) => c.id === activeColumn.id);

        const activeIndex = prev[colIndex].tasks.findIndex(
          (t) => t.id === activeId,
        );
        const overIndex = prev[colIndex].tasks.findIndex(
          (t) => t.id === overId,
        );

        if (activeIndex === overIndex) return prev;

        const newColumns = [...prev];
        newColumns[colIndex] = {
          ...newColumns[colIndex],
          tasks: arrayMove(newColumns[colIndex].tasks, activeIndex, overIndex),
        };

        console.log("Reordered within column", {
          id: activeId,
          from: activeIndex,
          to: overIndex,
        });

        return newColumns;
      });
    } else {
      console.log("Moved to new column", {
        id: activeId,
        fromColumn: activeColumn.id,
        toColumn: overColumn.id,
      });
    }
  };

  if (isLoading) {
    return <BoardViewSkeleton />;
  }

  if (!board) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <LayoutDashboard className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">
          {t("boards.notFound", "Board not found")}
        </h2>
        <Button
          variant="outline"
          onClick={() => navigate(`/projects/${projectId}`)}
        >
          {t("common.goBack", "Go Back")}
        </Button>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-(--spacing(32)))] flex flex-col space-y-4">
      <div className="flex items-center gap-4 pb-4 border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/projects/${projectId}`)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{board.name}</h1>
          <p className="text-sm text-muted-foreground">
            {board.type === BoardType.Kanban
              ? t("boards.type.kanban", "Kanban")
              : t("boards.type.scrum", "Scrum")}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        {board.type === BoardType.Kanban ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="h-full flex items-start gap-4 p-1">
              {isColumnsLoading ? (
                <div className="text-sm text-muted-foreground animate-pulse">
                  {t("common.loading", "Loading...")}
                </div>
              ) : (
                <>
                  {localColumns?.map((column) => (
                    <KanbanColumn key={column.id} column={column} />
                  ))}

                  <CreateColumnButton />
                </>
              )}
            </div>

            <DragOverlay>
              {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
            </DragOverlay>
          </DndContext>
        ) : (
          <div className="h-full flex items-center justify-center border-2 border-dashed rounded-lg text-muted-foreground">
            {t("boards.scrumPlaceholder", "Scrum Board Component will be here")}
          </div>
        )}
      </div>
    </div>
  );
}

function BoardViewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 pb-4 border-b">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-[200px]" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      </div>
      <div className="flex gap-4 h-[500px]">
        <Skeleton className="h-full w-[300px] rounded-xl" />
        <Skeleton className="h-full w-[300px] rounded-xl" />
        <Skeleton className="h-full w-[300px] rounded-xl" />
      </div>
    </div>
  );
}
