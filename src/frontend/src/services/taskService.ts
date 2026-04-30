import { api } from "@/lib/api";
import type { MoveTaskItemRequest, TaskItemDto } from "@/types/taskItem.types";

const urlBase = "core/api/tasks";

export const taskService = {
  moveTask: async (
    taskId: string,
    request: MoveTaskItemRequest,
  ): Promise<TaskItemDto> => {
    const response = await api.post<TaskItemDto>(
      `${urlBase}/${taskId}/move`,
      request,
    );
    return response.data;
  },
};
