import { api } from "@/lib/api";
import type { PagedResult } from "@/types/api.types";
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

  getPagedCompanyMembers: async (
    pageNumber: number,
    pageSize: number,
  ): Promise<PagedResult<MemberDto>> => {
    const response = await api.get<PagedResult<MemberDto>>(
      "identity/api/user/company/members/paged",
      {
        params: { pageNumber, pageSize },
      },
    );
    return response.data;
  },

  getPendingInvites: async (): Promise<PendingInviteDto[]> => {
    const response = await api.get<PendingInviteDto[]>(
      "identity/api/invitations/pending",
    );
    return response.data;
  },

  getPagedPendingInvites: async (
    pageNumber: number,
    pageSize: number,
  ): Promise<PagedResult<PendingInviteDto>> => {
    const response = await api.get<PagedResult<PendingInviteDto>>(
      "identity/api/invitations/pending/paged",
      {
        params: { pageNumber, pageSize },
      },
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

  getPagedTeams: async (
    pageNumber: number,
    pageSize: number,
  ): Promise<PagedResult<TeamDto>> => {
    const response = await api.get<PagedResult<TeamDto>>(
      "core/api/team/company/paged",
      {
        params: { pageNumber, pageSize },
      },
    );
    return response.data;
  },
};
