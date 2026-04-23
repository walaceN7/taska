import { authService } from "@/services/authService";
import { useAuthStore } from "@/stores/authStore";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ApiErrorResponse {
  error: string;
  statusCode: number;
}

export function useLoginMutation() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const { t } = useTranslation();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data, variables) => {
      if (data.requiresTwoFactor) {
        toast.info(t("auth.twoFactorRequired"));
        navigate("/verify-2fa", {
          state: {
            email: variables.email,
            twoFactorToken: data.twoFactorToken,
          },
        });
        return;
      }

      toast.success(t("auth.loginSuccess"));
      login();
      navigate("/dashboard");
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const message =
        error.response?.data?.error || t("auth.invalidCredentials");
      toast.error(message);
    },
  });
}

export function useRegisterMutation() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      toast.success(t("auth.registerSuccess"));
      login();
      navigate("/dashboard");
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const message = error.response?.data?.error || t("auth.registerError");
      toast.error(message);
    },
  });
}

export function useVerify2FAMutation() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: authService.verifyTwoFactor,
    onSuccess: () => {
      toast.success(t("auth.verify2FASuccess"));
      login();
      navigate("/dashboard");
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const message = error.response?.data?.error || t("auth.verify2FAError");
      toast.error(message);
    },
  });
}
