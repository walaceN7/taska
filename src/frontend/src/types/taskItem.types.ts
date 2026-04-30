export interface TaskItemDto {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: TaskPriority;
  type: TaskType;
  storyPoints?: number;
  order: number;
  columnId: string;
}

export interface CreateTaskItemRequest {
  title: string;
  description?: string;
  dueDate?: string;
  priority: TaskPriority;
  type: TaskType;
  storyPoints?: number;
}

export interface MoveTaskItemRequest {
  newColumnId: string;
  newOrder: number;
}

export const TaskPriority = {
  Low: 1,
  Medium: 2,
  High: 3,
  Critical: 4,
};

export const TaskType = {
  Bug: 0,
  Feature: 1,
  Improvement: 2,
  Technical: 3,
};

export type TaskPriority = (typeof TaskPriority)[keyof typeof TaskPriority];
export type TaskType = (typeof TaskType)[keyof typeof TaskType];
