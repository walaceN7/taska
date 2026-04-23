import { TaskaLogo } from "@/components/branding/TaskaLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateCompanyMutation } from "@/hooks/useCompany";
import { useAuthStore } from "@/stores/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LogOut } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

export function Onboarding() {
  const { t } = useTranslation();
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const createCompanyMutation = useCreateCompanyMutation();

  const onboardingSchema = z.object({
    name: z.string().min(3, {
      message: t(
        "auth.companyNameMin",
        "Company name must be at least 3 characters",
      ),
    }),
  });

  type OnboardingValues = z.infer<typeof onboardingSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: { name: "" },
  });

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
      <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-xl border shadow-sm relative">
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 text-muted-foreground hover:text-destructive"
          onClick={handleLogout}
          type="button"
        >
          <LogOut className="h-4 w-4 mr-2" />
          {t("auth.logout", "Logout")}
        </Button>

        <div className="text-center space-y-2 mt-4">
          <TaskaLogo className="h-10 mx-auto mb-6" />
          <h1 className="text-3xl font-bold tracking-tight">
            {t("auth.onboardingTitle", "Almost there!")}
          </h1>
          <p className="text-muted-foreground">
            {t("auth.onboardingSubtitle", "Give your workspace a name.")}
          </p>
        </div>

        <form
          onSubmit={handleSubmit((values) =>
            createCompanyMutation.mutate(values),
          )}
          className="space-y-6"
        >
          <div className="space-y-2">
            <Label htmlFor="name">
              {t("auth.companyNameLabel", "Company Name")}
            </Label>
            <Input
              id="name"
              placeholder={t("auth.companyNamePlaceholder", "Ex: Acme Corp")}
              disabled={createCompanyMutation.isPending}
              className="h-12 text-lg"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm font-medium text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-md"
            disabled={createCompanyMutation.isPending}
          >
            {createCompanyMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {t("common.loading", "Please wait...")}
              </>
            ) : (
              t("auth.onboardingButton", "Complete and Enter")
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
