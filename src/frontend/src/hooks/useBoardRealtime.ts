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

export interface ColumnCreatedEvent {
  columnId: string;
  boardId: string;
  name: string;
  order: number;
  userId: string;
  createdAt: string;
}

export interface TaskCreatedEvent {
  taskId: string;
  boardId: string;
  columnId: string;
  title: string;
  description?: string;
  priority: number;
  type: number;
  order: number;
  userId: string;
  createdAt: string;
}

export function useBoardRealtime(
  boardId: string | undefined,
  onTaskMoved: (event: TaskMovedEvent) => void,
  onColumnCreated: (event: ColumnCreatedEvent) => void,
  onTaskCreated: (event: TaskCreatedEvent) => void,
) {
  const { accessToken, user } = useAuthStore();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!boardId || !accessToken) return;

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

        setIsConnected(true);
        await connection.invoke("JoinBoard", boardId);

        connection.on("TaskMoved", (event: TaskMovedEvent) => {
          if (event.userId !== user?.userId) onTaskMoved(event);
        });

        connection.on("ColumnCreated", (event: ColumnCreatedEvent) => {
          if (event.userId !== user?.userId) onColumnCreated(event);
        });

        connection.on("TaskCreated", (event: TaskCreatedEvent) => {
          if (event.userId !== user?.userId) onTaskCreated(event);
        });
      } catch (err) {
        console.error("Error connecting to SignalR:", err);
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
  }, [
    boardId,
    accessToken,
    user?.userId,
    onTaskMoved,
    onColumnCreated,
    onTaskCreated,
  ]);

  return { isConnected };
}
