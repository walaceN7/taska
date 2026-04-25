import { api } from "@/lib/api";
import type { MemberDto, PendingInviteDto } from "@/types/team.types";

export const teamService = {
  getCompanyMembers: async (): Promise<MemberDto[]> => {
    const response = await api.get<MemberDto[]>(
      "identity/api/user/company/members",
    );
    return response.data;
  },

  getPendingInvites: async (): Promise<PendingInviteDto[]> => {
    const response = await api.get<PendingInviteDto[]>(
      "identity/api/invitations/pending",
    );
    return response.data;
  },
};
