export interface MemberDto {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  systemRole: "SaasAdmin" | "CompanyAdmin" | "Member";
}

export interface PendingInviteDto {
  id: string;
  email: string;
  sentAt?: string;
  expiresAt: string;
}

export interface TeamDto {
  id: string;
  name: string;
  description?: string;
  companyId: string;
  memberCount: number;
}

export interface TeamRequest {
  name: string;
  description?: string;
}
