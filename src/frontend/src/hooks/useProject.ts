import { projectService } from "@/services/projectService";
import type { ApiErrorResponse } from "@/types/api.types";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export function useCreateProjectMutation() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectService.createProject,
    onSuccess: async () => {
      toast.success(
        t("projects.createSuccess", "Project created successfully!"),
      );
      await queryClient.invalidateQueries({
        queryKey: ["projects", "infinite"],
      });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const message =
        error.response?.data?.error ||
        t("projects.createError", "Failed to create project");
      toast.error(message);
    },
  });
}

export function useInfiniteProjects(pageSize: number = 6) {
  return useInfiniteQuery({
    queryKey: ["projects", "infinite"],
    queryFn: ({ pageParam = 1 }) =>
      projectService.getPagedCompanyProjects(pageParam, pageSize),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.pageNumber + 1 : undefined;
    },
  });
}
