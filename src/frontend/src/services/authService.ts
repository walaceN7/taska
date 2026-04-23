import { api } from "@/lib/api";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  Verify2FARequest,
} from "@/types/auth.types";

export const authService = {
  login: async (payload: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/login", payload);
    return response.data;
  },

  register: async (payload: RegisterRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/register", payload);
    return response.data;
  },

  verifyTwoFactor: async (
    payload: Verify2FARequest,
  ): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/login/2fa", payload);
    return response.data;
  },
};
