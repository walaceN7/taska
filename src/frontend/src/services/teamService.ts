import { api } from "@/lib/api";
import type { PagedResult } from "@/types/api.types";
import type { TeamDto, TeamRequest } from "@/types/team.types";

const urlBase = "core/api/team";

export const teamService = {
  getTeams: async (): Promise<TeamDto[]> => {
    const response = await api.get<TeamDto[]>(`${urlBase}/company`);
    return response.data;
  },

  createTeam: async (request: TeamRequest): Promise<TeamDto> => {
    const response = await api.post<TeamDto>(urlBase, request);
    return response.data;
  },

  getPagedTeams: async (
    pageNumber: number,
    pageSize: number,
  ): Promise<PagedResult<TeamDto>> => {
    const response = await api.get<PagedResult<TeamDto>>(
      `${urlBase}/company/paged`,
      {
        params: { pageNumber, pageSize },
      },
    );
    return response.data;
  },
};
