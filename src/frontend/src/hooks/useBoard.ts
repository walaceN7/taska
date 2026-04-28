import { boardService } from "@/services/boardService";
import type { ApiErrorResponse } from "@/types/api.types";
import type { UpdateBoardRequest } from "@/types/board.types";
import type { CreateColumnRequest } from "@/types/column.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export function useBoard(id: string) {
  return useQuery({
    queryKey: ["board", id],
    queryFn: () => boardService.getBoardById(id),
    enabled: !!id,
  });
}

export function useCreateBoardMutation() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: boardService.createBoard,
    onSuccess: async () => {
      toast.success(t("boards.createSuccess", "Board created successfully!"));
      await queryClient.invalidateQueries({
        queryKey: ["boards", "paged"],
      });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const message =
        error.response?.data?.error ||
        t("boards.createError", "Failed to create board");
      toast.error(message);
    },
  });
}

export function useUpdateBoardMutation() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      request,
    }: {
      id: string;
      request: UpdateBoardRequest;
    }) => boardService.updateBoard(id, request),
    onSuccess: async () => {
      toast.success(t("boards.updateSuccess", "Board updated successfully!"));
      await queryClient.invalidateQueries({
        queryKey: ["boards", "paged"],
      });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const message =
        error.response?.data?.error ||
        t("boards.updateError", "Failed to update board");
      toast.error(message);
    },
  });
}

export function useDeleteBoardMutation() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => boardService.deleteBoard(id),
    onSuccess: async () => {
      toast.success(t("boards.deleteSuccess", "Board deleted successfully!"));
      await queryClient.invalidateQueries({
        queryKey: ["boards", "paged"],
      });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const message =
        error.response?.data?.error ||
        t("boards.deleteError", "Failed to delete board");
      toast.error(message);
    },
  });
}

export function usePagedBoards(
  projectId: string,
  pageIndex: number,
  pageSize: number,
) {
  return useQuery({
    queryKey: ["boards", "paged", projectId, pageIndex, pageSize],
    queryFn: () =>
      boardService.getPagedBoards(projectId, pageIndex + 1, pageSize),
    placeholderData: (previousData) => previousData,
  });
}

export function useColumnsBoard(id: string) {
  return useQuery({
    queryKey: ["columns", "board", id],
    queryFn: () => boardService.getColumnsBoard(id),
    enabled: !!id,
  });
}

export function useCreateColumnMutation() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      request,
    }: {
      id: string;
      request: CreateColumnRequest;
    }) => boardService.createColumn(id, request),

    onSuccess: async (_, variables) => {
      toast.success(t("columns.createSuccess", "Column created successfully!"));

      await queryClient.invalidateQueries({
        queryKey: ["columns", "board", variables.id],
      });
    },

    onError: (error: AxiosError<ApiErrorResponse>) => {
      const message =
        error.response?.data?.error ||
        t("columns.createError", "Failed to create column");
      toast.error(message);
    },
  });
}
