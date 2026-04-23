import { api } from "@/lib/api";
import type {
  SsoLoginRequest,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  Verify2FARequest,
} from "@/types/auth.types";

const urlBase = "identity/api/auth";

export const authService = {
  login: async (payload: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>(`${urlBase}/login`, payload);
    return response.data;
  },

  register: async (payload: RegisterRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>(
      `${urlBase}/register`,
      payload,
    );
    return response.data;
  },

  verifyTwoFactor: async (
    payload: Verify2FARequest,
  ): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>(
      `${urlBase}/login/2fa`,
      payload,
    );
    return response.data;
  },

  googleLogin: async (payload: SsoLoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>(
      `${urlBase}/google-login`,
      payload,
    );
    return response.data;
  },

  refreshToken: async (): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>(`${urlBase}/refresh`);
    return response.data;
  },
};
