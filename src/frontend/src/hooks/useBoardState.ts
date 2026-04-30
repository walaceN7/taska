import {
  useBoardRealtime,
  type ColumnCreatedEvent,
  type TaskCreatedEvent,
  type TaskMovedEvent,
} from "@/hooks/useBoardRealtime";
import { useMoveTaskMutation } from "@/hooks/useTask";
import type { ColumnDto } from "@/types/column.types";
import type { TaskItemDto } from "@/types/taskItem.types";
import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useCallback, useState } from "react";

export function useBoardState(
  boardId: string | undefined,
  initialColumns: ColumnDto[] | undefined,
) {
  const [localColumns, setLocalColumns] = useState<ColumnDto[]>([]);
  const [prevColumns, setPrevColumns] = useState<ColumnDto[] | undefined>(
    undefined,
  );
  const [activeTask, setActiveTask] = useState<TaskItemDto | null>(null);

  if (initialColumns !== prevColumns) {
    setPrevColumns(initialColumns);
    if (initialColumns) {
      setLocalColumns(initialColumns);
    }
  }

  const moveTaskMutation = useMoveTaskMutation(boardId!);

  const findColumn = useCallback(
    (uniqueId: string) => {
      if (localColumns.find((c) => c.id === uniqueId)) {
        return localColumns.find((c) => c.id === uniqueId);
      }
      return localColumns.find((c) => c.tasks.find((t) => t.id === uniqueId));
    },
    [localColumns],
  );

  const handleRemoteTaskMove = useCallback((event: TaskMovedEvent) => {
    setLocalColumns((prev) => {
      const newColumns = prev.map((c) => ({ ...c, tasks: [...c.tasks] }));
      const fromColIndex = newColumns.findIndex(
        (c) => c.id === event.fromColumnId,
      );
      const toColIndex = newColumns.findIndex((c) => c.id === event.toColumnId);

      if (fromColIndex === -1 || toColIndex === -1) return prev;

      const taskIndex = newColumns[fromColIndex].tasks.findIndex(
        (t) => t.id === event.taskId,
      );
      if (taskIndex === -1) return prev;

      const [movedTask] = newColumns[fromColIndex].tasks.splice(taskIndex, 1);
      movedTask.columnId = event.toColumnId;
      newColumns[toColIndex].tasks.splice(event.newOrder, 0, movedTask);

      return newColumns;
    });
  }, []);

  const handleRemoteColumnCreate = useCallback((event: ColumnCreatedEvent) => {
    setLocalColumns((prev) => {
      if (prev.some((c) => c.id === event.columnId)) return prev;

      const newColumn: ColumnDto = {
        id: event.columnId,
        name: event.name,
        order: event.order,
        tasks: [],
      };

      return [...prev, newColumn].sort((a, b) => a.order - b.order);
    });
  }, []);

  const handleRemoteTaskCreate = useCallback((event: TaskCreatedEvent) => {
    setLocalColumns((prev) => {
      const newColumns = prev.map((c) => ({ ...c, tasks: [...c.tasks] }));
      const colIndex = newColumns.findIndex((c) => c.id === event.columnId);

      if (colIndex === -1) return prev;
      if (newColumns[colIndex].tasks.some((t) => t.id === event.taskId))
        return prev;

      const newTask: TaskItemDto = {
        id: event.taskId,
        title: event.title,
        priority: event.priority,
        type: event.type,
        order: event.order,
        columnId: event.columnId,
      };

      if (event.description) {
        newTask.description = event.description;
      }

      newColumns[colIndex].tasks.push(newTask);
      newColumns[colIndex].tasks.sort((a, b) => a.order - b.order);

      return newColumns;
    });
  }, []);

  useBoardRealtime(
    boardId,
    handleRemoteTaskMove,
    handleRemoteColumnCreate,
    handleRemoteTaskCreate,
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const id = String(event.active.id);
      const column = findColumn(id);
      if (column) {
        const task = column.tasks.find((t) => t.id === id);
        if (task) setActiveTask(task);
      }
    },
    [findColumn],
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
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
          const activeColIndex = prev.findIndex(
            (c) => c.id === activeColumn.id,
          );
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
    },
    [findColumn],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveTask(null);
      const { active, over } = event;

      if (!over) return;

      const activeId = String(active.id);
      const overId = String(over.id);

      const activeColumn = findColumn(activeId);
      const overColumn = findColumn(overId);

      if (!activeColumn || !overColumn) return;

      const activeIndex = activeColumn.tasks.findIndex(
        (t) => t.id === activeId,
      );
      let overIndex = overColumn.tasks.findIndex((t) => t.id === overId);

      if (overIndex === -1) {
        overIndex =
          overColumn.tasks.length > 0 ? overColumn.tasks.length - 1 : 0;
      }

      moveTaskMutation.mutate({
        taskId: activeId,
        request: {
          newColumnId: overColumn.id,
          newOrder: overIndex,
        },
      });

      if (activeColumn.id === overColumn.id && activeIndex !== overIndex) {
        setLocalColumns((prev) => {
          const colIndex = prev.findIndex((c) => c.id === activeColumn.id);
          const newColumns = [...prev];

          newColumns[colIndex] = {
            ...newColumns[colIndex],
            tasks: arrayMove(
              newColumns[colIndex].tasks,
              activeIndex,
              overIndex,
            ),
          };

          return newColumns;
        });
      }
    },
    [findColumn, moveTaskMutation],
  );

  return {
    localColumns,
    activeTask,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
}
