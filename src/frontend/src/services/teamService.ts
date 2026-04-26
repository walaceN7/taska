import { api } from "@/lib/api";
import type {
  MemberDto,
  PendingInviteDto,
  TeamDto,
  TeamRequest,
} from "@/types/team.types";

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

  getTeams: async (): Promise<TeamDto[]> => {
    const response = await api.get<TeamDto[]>("core/api/team/company");
    return response.data;
  },

  createTeam: async (request: TeamRequest): Promise<TeamDto> => {
    const response = await api.post<TeamDto>("core/api/team", request);
    return response.data;
  },
};
