import { teamService } from "@/services/teamService";
import type { ApiErrorResponse } from "@/types/api.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export function useCompanyMembers() {
  return useQuery({
    queryKey: ["companyMembers"],
    queryFn: teamService.getCompanyMembers,
  });
}

export function usePagedCompanyMembers(pageNumber: number, pageSize: number) {
  return useQuery({
    queryKey: ["companyMembers", "paged", pageNumber, pageSize],
    queryFn: () => teamService.getPagedCompanyMembers(pageNumber, pageSize),
    placeholderData: (previousData) => previousData,
  });
}

export function usePendingInvites() {
  return useQuery({
    queryKey: ["pendingInvites"],
    queryFn: teamService.getPendingInvites,
  });
}

export function usePagedPendingInvites(pageNumber: number, pageSize: number) {
  return useQuery({
    queryKey: ["pendingInvites", "paged", pageNumber, pageSize],
    queryFn: () => teamService.getPagedPendingInvites(pageNumber, pageSize),
    placeholderData: (previousData) => previousData,
  });
}

export function useTeams() {
  return useQuery({
    queryKey: ["teams"],
    queryFn: teamService.getTeams,
  });
}

export function useCreateTeamMutation() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: teamService.createTeam,
    onSuccess: async () => {
      toast.success(t("team.createSuccess", "Team created successfully!"));
      await queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const message =
        error.response?.data?.error ||
        t("team.createError", "Failed to create team.");
      toast.error(message);
    },
  });
}

export function usePagedTeams(pageNumber: number, pageSize: number) {
  return useQuery({
    queryKey: ["teams", "paged", pageNumber, pageSize],
    queryFn: () => teamService.getPagedTeams(pageNumber, pageSize),
    placeholderData: (previousData) => previousData,
  });
}
