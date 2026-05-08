import { userService } from "@/services/userService";
import { useQuery } from "@tanstack/react-query";

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
