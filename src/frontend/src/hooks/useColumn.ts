import { columnService } from "@/services/columnService";
import type { ApiErrorResponse } from "@/types/api.types";
import type { MoveColumnRequest } from "@/types/column.types";
import type { CreateTaskItemRequest } from "@/types/taskItem.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export function useCreateTaskItemMutation(boardId: string) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      columnId,
      request,
    }: {
      columnId: string;
      request: CreateTaskItemRequest;
    }) => columnService.createTaskItem(columnId, request),

    onSuccess: async () => {
      toast.success(
        t("taskItems.createSuccess", "Task item created successfully!"),
      );

      await queryClient.invalidateQueries({
        queryKey: ["columns", "board", boardId],
      });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const message =
        error.response?.data?.error ||
        t("taskItems.createError", "Failed to create task item");
      toast.error(message);
    },
  });
}

export function useMoveColumnMutation(boardId: string) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      columnId,
      request,
    }: {
      columnId: string;
      request: MoveColumnRequest;
    }) => columnService.moveColumn(columnId, request),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["columns", "board", boardId],
      });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const message =
        error.response?.data?.error ||
        t("columns.moveError", "Failed to move column.");
      toast.error(message);

      queryClient.invalidateQueries({
        queryKey: ["columns", "board", boardId],
      });
    },
  });
}
