import { api } from "@/lib/api";
import type { PagedResult } from "@/types/api.types";
import type {
  AddProjectMemberRequest,
  CreateProjectRequest,
  ProjectDto,
  RemoveProjectMemberRequest,
  UpdateProjectMemberRoleRequest,
  UpdateProjectRequest,
} from "@/types/project.types";

const urlBase = "core/api/project";

export const projectService = {
  getProjectById: async (id: string): Promise<ProjectDto> => {
    const response = await api.get<ProjectDto>(`${urlBase}/${id}`);
    return response.data;
  },

  createProject: async (request: CreateProjectRequest): Promise<ProjectDto> => {
    const response = await api.post<ProjectDto>(`${urlBase}`, request);
    return response.data;
  },

  updateProject: async (request: UpdateProjectRequest): Promise<ProjectDto> => {
    const { projectId, ...body } = request;
    const response = await api.put<ProjectDto>(`${urlBase}/${projectId}`, body);
    return response.data;
  },

  deleteProject: async (id: string): Promise<void> => {
    await api.delete<void>(`${urlBase}/${id}`);
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

  addProjectMember: async ({
    projectId,
    userId,
    role,
  }: AddProjectMemberRequest) => {
    const response = await api.post<ProjectDto>(
      `${urlBase}/${projectId}/members`,
      {
        userId,
        role,
      },
    );
    return response.data;
  },

  removeProjectMember: async ({
    projectId,
    userId,
  }: RemoveProjectMemberRequest): Promise<void> => {
    await api.delete(`${urlBase}/${projectId}/members/${userId}`);
  },

  updateProjectMemberRole: async ({
    projectId,
    userId,
    role,
  }: UpdateProjectMemberRoleRequest) => {
    const response = await api.patch<ProjectDto>(
      `${urlBase}/${projectId}/members/${userId}`,
      { role },
    );
    return response.data;
  },
};
