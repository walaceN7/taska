import { api } from "@/lib/api";
import type { MoveColumnRequest } from "@/types/column.types";
import type {
  CreateTaskItemRequest,
  TaskItemDto,
} from "@/types/taskItem.types";

const urlBase = "core/api/column";

export const columnService = {
  createTaskItem: async (
    id: string,
    request: CreateTaskItemRequest,
  ): Promise<TaskItemDto> => {
    const response = await api.post<TaskItemDto>(
      `${urlBase}/${id}/tasks`,
      request,
    );
    return response.data;
  },

  moveColumn: async (
    columnId: string,
    request: MoveColumnRequest,
  ): Promise<void> => {
    await api.post(`${urlBase}/${columnId}/move`, request);
  },
};
