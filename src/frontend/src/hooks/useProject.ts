import { projectService } from "@/services/projectService";
import type { ApiErrorResponse } from "@/types/api.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export function useProject(id: string) {
  return useQuery({
    queryKey: ["project", id],
    queryFn: () => projectService.getProjectById(id),
    enabled: !!id,
  });
}

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
        queryKey: ["projects"],
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

export function usePagedProjects(pageIndex: number, pageSize: number) {
  return useQuery({
    queryKey: ["projects", "paged", pageIndex, pageSize],
    queryFn: () =>
      projectService.getPagedCompanyProjects(pageIndex + 1, pageSize),
    placeholderData: (previousData) => previousData,
  });
}

export const useAddProjectMember = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectService.addProjectMember,
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["projects"] }),
        queryClient.invalidateQueries({
          queryKey: ["project", variables.projectId],
        }),
      ]);

      toast.success(
        t("projects.addMemberSuccess", "Member added successfully!"),
      );
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const errorMessage =
        error.response?.data?.error ||
        t("projects.addMemberError", "Failed to add member");
      toast.error(errorMessage);
    },
  });
};

export const useRemoveProjectMember = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectService.removeProjectMember,
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["projects"] }),
        queryClient.invalidateQueries({
          queryKey: ["project", variables.projectId],
        }),
        queryClient.removeQueries({ queryKey: ["usersByIds"] }),
      ]);

      toast.success(
        t("projects.removeMemberSuccess", "Member removed successfully!"),
      );
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const errorMessage =
        error.response?.data?.error ||
        t("projects.removeMemberError", "Failed to remove member");
      toast.error(errorMessage);
    },
  });
};

export const useUpdateProjectMemberRole = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectService.updateProjectMemberRole,
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["projects"] }),
        queryClient.invalidateQueries({
          queryKey: ["project", variables.projectId],
        }),
      ]);

      toast.success(
        t("projects.updateRoleSuccess", "Role updated successfully!"),
      );
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const errorMessage =
        error.response?.data?.error ||
        t("projects.updateRoleError", "Failed to update role");
      toast.error(errorMessage);
    },
  });
};
