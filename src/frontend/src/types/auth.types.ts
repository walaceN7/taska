export interface UserDto {
  userId: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  systemRole: string;
  companyId?: string;
}

export interface LoginResponse {
  message?: string;
  user?: UserDto;
  accessToken: string;
  requiresTwoFactor?: boolean;
  twoFactorToken?: string;
  deviceToken?: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
  turnstileToken: string;
  rememberMe?: boolean;
}

export interface Verify2FARequest {
  email: string;
  code: string;
  twoFactorToken: string;
  rememberDevice: boolean;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  password: string;
  planId: number;
  turnstileToken: string;
}

export interface SsoLoginRequest {
  accessToken: string;
}

export interface RegisterWithInvitationRequest {
  token: string;
  firstName: string;
  lastName: string;
  password: string;
}
