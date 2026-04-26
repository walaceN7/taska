export interface ProjectDto {
  id: string;
  name: string;
  startDate?: string;
  endDate?: string;
  status: ProjectStatus;
  companyId: string;
  companyName: string;
}

export const ProjectStatus = {
  Planning: 1,
  Active: 2,
  OnHold: 3,
  Completed: 4,
  Cancelled: 5,
} as const;

export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus];
