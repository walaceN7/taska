import { api } from "@/lib/api";
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
};
