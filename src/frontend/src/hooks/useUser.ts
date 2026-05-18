import { userService } from "@/services/userService";
import type { UserRole } from "@/types/user.types";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export function usePagedCompanyMembers(pageNumber: number, pageSize: number) {
  return useQuery({
    queryKey: ["companyMembers", "paged", pageNumber, pageSize],
    queryFn: () => userService.getPagedCompanyMembers(pageNumber, pageSize),
    placeholderData: (previousData) => previousData,
  });
}

export function usePendingInvites() {
  return useQuery({
    queryKey: ["pendingInvites"],
    queryFn: userService.getPendingInvites,
  });
}

export function usePagedPendingInvites(pageNumber: number, pageSize: number) {
  return useQuery({
    queryKey: ["pendingInvites", "paged", pageNumber, pageSize],
    queryFn: () => userService.getPagedPendingInvites(pageNumber, pageSize),
    placeholderData: (previousData) => previousData,
  });
}

export function useUsersByIds(ids: string[]) {
  return useQuery({
    queryKey: ["usersByIds", ids],
    queryFn: () => userService.getUsersByIds(ids),
    placeholderData: (previousData) => previousData,
    enabled: ids.length > 0,
  });
}

export function useSearchCompanyMembers(searchTerm: string) {
  return useInfiniteQuery({
    queryKey: ["companyMembers", "search", searchTerm],
    queryFn: ({ pageParam = 1 }) =>
      userService.searchCompanyMembers(searchTerm, pageParam, 10),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.pageNumber + 1 : undefined;
    },
  });
}

export function useUpdateCompanyMemberRole() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: UserRole }) =>
      userService.updateCompanyMemberRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companyMembers"] });
      toast.success(t("team.roleUpdated", "Role updated successfully!"));
    },
    onError: () => {
      toast.error(t("common.error", "An error occurred."));
    },
  });
}

export function useRemoveCompanyMember() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (userId: string) => userService.removeCompanyMember(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companyMembers"] });
      toast.success(t("team.memberRemoved", "Member removed from company."));
    },
    onError: () => {
      toast.error(t("common.error", "An error occurred."));
    },
  });
}
