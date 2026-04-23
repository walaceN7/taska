import { authService } from "@/services/authService";
import { companyService } from "@/services/companyService";
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

export function useCreateCompanyMutation() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: companyService.create,
    onSuccess: async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const refreshData = await authService.refreshToken();

        if (refreshData.user) {
          login(refreshData.user, refreshData.accessToken!);
        }

        toast.success(
          t("auth.companyCreated", "Workspace created successfully!"),
        );
        navigate("/dashboard", { replace: true });
      } catch (error) {
        console.error("Error refreshing token:", error);
        toast.error(
          t(
            "auth.companyCreatedErrorLoginAgain",
            "Company created successfully, but please login again to access.",
          ),
        );

        useAuthStore.getState().logout();
        navigate("/login");
      }
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      console.error("Onboarding failed:", error);
      toast.error(
        t(
          "auth.companyCreateError",
          "Failed to create workspace. Please try again.",
        ),
      );
    },
  });
}
