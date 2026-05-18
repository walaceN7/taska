export type UserRole = "SaasAdmin" | "CompanyAdmin" | "Member";

export const UserRoleMap: Record<UserRole, number> = {
  SaasAdmin: 1,
  CompanyAdmin: 2,
  Member: 3,
};

export interface MemberDto {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  systemRole: UserRole;
}

export interface UpdateMemberRoleDto {
  userId: string;
  role: number;
}
