import { useAuthStore } from "@/stores/authStore";
import * as signalR from "@microsoft/signalr";
import { useEffect, useState } from "react";

export interface TaskMovedEvent {
  taskId: string;
  boardId: string;
  fromColumnId: string;
  toColumnId: string;
  newOrder: number;
  userId: string;
  movedAt: string;
}

export function useBoardRealtime(
  boardId: string | undefined,
  onTaskMoved: (event: TaskMovedEvent) => void,
) {
  const { accessToken, user } = useAuthStore();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!boardId || !accessToken) {
      return;
    }

    const gatewayUrl = `${import.meta.env.VITE_API_URL}notify/hubs/board`;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(gatewayUrl, {
        accessTokenFactory: () => accessToken,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    let isMounted = true;

    const startConnection = async () => {
      try {
        await connection.start();
        if (!isMounted) return;

        setIsConnected(true);

        await connection.invoke("JoinBoard", boardId);

        connection.on("TaskMoved", (event: TaskMovedEvent) => {
          if (event.userId !== user?.userId) {
            onTaskMoved(event);
          }
        });
      } catch (err) {
        console.error(err);
      }
    };

    startConnection();

    return () => {
      isMounted = false;
      if (connection.state === signalR.HubConnectionState.Connected) {
        connection
          .invoke("LeaveBoard", boardId)
          .then(() => connection.stop())
          .catch(console.error);
      } else {
        connection.stop();
      }
    };
  }, [boardId, accessToken, user?.userId, onTaskMoved]);

  return { isConnected };
}
