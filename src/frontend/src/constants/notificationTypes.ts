export const NotificationType = {
  TaskCreated: "task.created",
  TaskMoved: "task.moved",
  TaskAssigned: "task.assigned",
  ColumnCreated: "column.created",
} as const;

export type AppNotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];
