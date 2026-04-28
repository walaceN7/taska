import type { TaskItemDto } from "./taskItem.types";

export interface ColumnDto {
  id: string;
  name: string;
  order: number;
  tasks: TaskItemDto[];
}

export interface CreateColumnRequest {
  name: string;
}
