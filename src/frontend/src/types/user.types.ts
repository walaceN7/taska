export interface MemberDto {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  systemRole: "SaasAdmin" | "CompanyAdmin" | "Member";
}
