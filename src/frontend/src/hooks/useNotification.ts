import { notificationService } from "@/services/notificationService";
import type { ApiErrorResponse } from "@/types/api.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

export function useUnreadNotifications(isAuthenticated: boolean) {
  return useQuery({
    queryKey: ["notifications", "unread"],
    queryFn: notificationService.getUnread,
    enabled: isAuthenticated,
  });
}

export function useMarkNotificationAsReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread"] });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      console.error("Failed to mark notification as read:", error);
    },
  });
}

export function useMarkAllNotificationsAsReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationService.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread"] });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      console.error("Failed to mark all notifications as read:", error);
      toast.error("Failed to update notifications");
    },
  });
}
