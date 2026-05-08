export interface ProjectDto {
  id: string;
  name: string;
  startDate?: string;
  endDate?: string;
  status: ProjectStatus;
  companyId: string;
  companyName: string;
  members: ProjectMemberResult[];
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export interface AddProjectMemberRequest {
  projectId: string;
  userId: string;
  role: ProjectRole;
}

export interface RemoveProjectMemberRequest {
  projectId: string;
  userId: string;
}

export interface ProjectMemberResult {
  userId: string;
  role: ProjectRole;
}

export const ProjectStatus = {
  Planning: 1,
  Active: 2,
  OnHold: 3,
  Completed: 4,
  Cancelled: 5,
} as const;

export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus];

export const ProjectRole = {
  Manager: 1,
  Developer: 2,
  Viewer: 3,
} as const;

export type ProjectRole = (typeof ProjectRole)[keyof typeof ProjectRole];
