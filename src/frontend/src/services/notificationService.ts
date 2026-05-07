import { api } from "@/lib/api";
import type { NotificationDto } from "@/types/notification.types";

const urlBase = "notify/api/notification";

export const notificationService = {
  getUnread: async (): Promise<NotificationDto[]> => {
    const response = await api.get<NotificationDto[]>(urlBase);
    return response.data;
  },

  markAsRead: async (id: string): Promise<void> => {
    await api.put(`${urlBase}/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await api.put(`${urlBase}/read-all`);
  },
};
