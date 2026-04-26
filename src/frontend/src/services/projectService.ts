import { api } from "@/lib/api";
import type { PagedResult } from "@/types/api.types";
import type { CreateProjectRequest, ProjectDto } from "@/types/project.types";

const urlBase = "core/api/project";

export const projectService = {
  createProject: async (request: CreateProjectRequest): Promise<ProjectDto> => {
    const response = await api.post<ProjectDto>(`${urlBase}`, request);
    return response.data;
  },

  getPagedCompanyProjects: async (
    pageNumber: number,
    pageSize: number,
  ): Promise<PagedResult<ProjectDto>> => {
    const response = await api.get<PagedResult<ProjectDto>>(
      `${urlBase}/company/paged`,
      {
        params: { pageNumber, pageSize },
      },
    );
    return response.data;
  },
};
