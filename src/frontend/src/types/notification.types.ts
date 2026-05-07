import { type AppNotificationType } from "@/constants/notificationTypes";

export interface NotificationDto {
  id: string;
  recipientUserId: string;
  actorUserId: string;
  actorName: string;
  type: AppNotificationType | string;
  payload: string;
  boardId: string;
  isRead: boolean;
  createdAt: string;
}
