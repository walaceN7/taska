import { taskService } from "@/services/taskService";
import type { ApiErrorResponse } from "@/types/api.types";
import type { MoveTaskItemRequest } from "@/types/taskItem.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export function useMoveTaskMutation(boardId: string) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      request,
    }: {
      taskId: string;
      request: MoveTaskItemRequest;
    }) => taskService.moveTask(taskId, request),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["columns", "board", boardId],
      });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const message =
        error.response?.data?.error ||
        t("taskItems.moveError", "Failed to move task.");
      toast.error(message);
      queryClient.invalidateQueries({
        queryKey: ["columns", "board", boardId],
      });
    },
  });
}
