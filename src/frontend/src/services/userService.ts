import { api } from "@/lib/api";
import type { PagedResult } from "@/types/api.types";
import type { PendingInviteDto } from "@/types/team.types";
import {
  UserRoleMap,
  type MemberDto,
  type UpdateMemberRoleDto,
  type UserRole,
} from "@/types/user.types";

const urlBase = "identity/api/user";

export const userService = {
  getCompanyMembers: async (): Promise<MemberDto[]> => {
    const response = await api.get<MemberDto[]>(`${urlBase}/company/members`);
    return response.data;
  },

  getPagedCompanyMembers: async (
    pageNumber: number,
    pageSize: number,
  ): Promise<PagedResult<MemberDto>> => {
    const response = await api.get<PagedResult<MemberDto>>(
      `${urlBase}/company/members/paged`,
      {
        params: { pageNumber, pageSize },
      },
    );
    return response.data;
  },

  getPendingInvites: async (): Promise<PendingInviteDto[]> => {
    const response = await api.get<PendingInviteDto[]>(
      `${urlBase}/invitations/pending`,
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

  getUsersByIds: async (ids: string[]) => {
    const response = await api.post<MemberDto[]>(`${urlBase}/by/ids`, ids);
    return response.data;
  },

  searchCompanyMembers: async (
    searchTerm: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<PagedResult<MemberDto>> => {
    const response = await api.get<PagedResult<MemberDto>>(
      `${urlBase}/company/members/search`,
      {
        params: { searchTerm, pageNumber, pageSize },
      },
    );
    return response.data;
  },

  updateCompanyMemberRole: async (
    userId: string,
    role: UserRole,
  ): Promise<void> => {
    const roleNumber = UserRoleMap[role];

    await api.put<UpdateMemberRoleDto>(`${urlBase}/members/${userId}/role`, {
      userId,
      role: roleNumber,
    });
  },
  removeCompanyMember: async (userId: string): Promise<void> => {
    await api.delete(`${urlBase}/members/${userId}`);
  },
};
