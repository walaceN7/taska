import { teamService } from "@/services/teamService";
import { useQuery } from "@tanstack/react-query";

export function useCompanyMembers() {
  return useQuery({
    queryKey: ["companyMembers"],
    queryFn: teamService.getCompanyMembers,
  });
}

export function usePendingInvites() {
  return useQuery({
    queryKey: ["pendingInvites"],
    queryFn: teamService.getPendingInvites,
  });
}
