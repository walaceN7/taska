export interface InvitationDto {
  id: string;
  email: string;
  companyId: string;
  expiresAt: string;
  isAccepted: boolean;
}

export interface SendInvitationRequest {
  email: string;
}
