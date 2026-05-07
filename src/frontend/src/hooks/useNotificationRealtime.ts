import { useAuthStore } from "@/stores/authStore";
import type { NotificationDto } from "@/types/notification.types";
import * as signalR from "@microsoft/signalr";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export function useNotificationRealtime() {
  const { accessToken, user } = useAuthStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user?.userId || !accessToken) return;

    const gatewayUrl = `${import.meta.env.VITE_API_URL}notify/hubs/board`;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(gatewayUrl, {
        accessTokenFactory: () => accessToken,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();

    let isMounted = true;

    const startConnection = async () => {
      try {
        await connection.start();
        if (!isMounted) return;

        await connection.invoke("JoinUserNotifications", user.userId);

        connection.on("NewNotification", (notification: NotificationDto) => {
          queryClient.setQueryData<NotificationDto[]>(
            ["notifications", "unread"],
            (oldData) => {
              return [notification, ...(oldData || [])];
            },
          );
        });
      } catch (err) {
        console.error("Error connecting to Notification SignalR:", err);
      }
    };

    startConnection();

    return () => {
      isMounted = false;
      if (connection.state === signalR.HubConnectionState.Connected) {
        connection
          .invoke("LeaveUserNotifications", user.userId)
          .then(() => connection.stop())
          .catch(console.error);
      } else {
        connection.stop();
      }
    };
  }, [accessToken, user?.userId, queryClient]);
}
