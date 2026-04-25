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
