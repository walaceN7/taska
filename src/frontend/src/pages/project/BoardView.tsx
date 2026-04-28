import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useBoard, useColumnsBoard } from "@/hooks/useBoard";
import { BoardType } from "@/types/board.types";
import type { ColumnDto } from "@/types/column.types";
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { KanbanColumn } from "./components/kanban/KanbanColumn";

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
  const [lastFetchedColumns, setLastFetchedColumns] = useState<
    ColumnDto[] | undefined
  >(undefined);

  if (columns && columns !== lastFetchedColumns) {
    setLocalColumns(columns);
    setLastFetchedColumns(columns);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    console.log("Começou a arrastar:", event.active.id);
  };

  const handleDragOver = (event: DragOverEvent) => {
    console.log("Passou por cima", event.over?.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    console.log("Soltou o item", event.over?.id);
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
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="h-full flex items-start gap-4 p-1">
              {isColumnsLoading ? (
                <div className="text-sm text-muted-foreground animate-pulse">
                  {t("common.loading", "Loading...")}
                </div>
              ) : localColumns?.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  {t("boards.emptyColumns", "No columns found")}
                </div>
              ) : (
                localColumns?.map((column) => (
                  <KanbanColumn key={column.id} column={column} />
                ))
              )}
            </div>
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

// ... manter o esqueleto embaixo (BoardViewSkeleton)

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
