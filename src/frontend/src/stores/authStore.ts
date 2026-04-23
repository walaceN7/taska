import type { UserDto } from "@/types/auth.types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  user: UserDto | null;
  accessToken: string | null;
  login: (user: UserDto, accessToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      login: (user, accessToken) =>
        set({ isAuthenticated: true, user, accessToken }),
      logout: () =>
        set({ isAuthenticated: false, user: null, accessToken: null }),
    }),
    {
      name: "taska-auth-storage",
    },
  ),
);
