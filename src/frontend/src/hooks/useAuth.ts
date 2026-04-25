import { authService } from "@/services/authService";
import { useAuthStore } from "@/stores/authStore";
import type { ApiErrorResponse } from "@/types/api.types";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
      login(data.user!, data.accessToken!);
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
    onSuccess: (data) => {
      toast.success(t("auth.registerSuccess"));
      login(data.user!, data.accessToken!);
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
    onSuccess: (data) => {
      toast.success(t("auth.verify2FASuccess"));
      login(data.user!, data.twoFactorToken!);
      navigate("/dashboard");
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const message = error.response?.data?.error || t("auth.verify2FAError");
      toast.error(message);
    },
  });
}

export function useGoogleLoginMutation() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const { t } = useTranslation();

  return useMutation({
    mutationFn: authService.googleLogin,
    onSuccess: (data) => {
      login(data.user!, data.accessToken!);

      toast.success(t("auth.loginSuccess"));
      navigate("/dashboard");
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const message = error.response?.data?.error || t("auth.googleLoginError");
      toast.error(message);
    },
  });
}

export function useRegisterWithInvitationMutation() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: authService.registerWithInvitation,
    onSuccess: (data) => {
      toast.success(
        t("auth.inviteAccepted", "Welcome! Your account is ready."),
      );
      login(data.user!, data.accessToken!);
      navigate("/dashboard");
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const message =
        error.response?.data?.error ||
        t("auth.inviteError", "Failed to accept invitation.");
      toast.error(message);
    },
  });
}
