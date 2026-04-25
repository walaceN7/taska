import { TaskaLogo } from "@/components/branding/TaskaLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegisterWithInvitationMutation } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Navigate, useSearchParams } from "react-router-dom";
import { z } from "zod";

export function RegisterInvite() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const registerInviteSchema = z
    .object({
      firstName: z.string().min(2, t("auth.fieldRequired", "Required field")),
      lastName: z.string().min(2, t("auth.fieldRequired", "Required field")),
      password: z
        .string()
        .min(8, t("auth.passwordMinLength", "Minimum 8 characters")),
      confirmPassword: z
        .string()
        .min(8, t("auth.fieldRequired", "Required field")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("auth.passwordMismatch", "Passwords do not match"),
      path: ["confirmPassword"],
    });

  type RegisterInviteValues = z.infer<typeof registerInviteSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInviteValues>({
    resolver: zodResolver(registerInviteSchema),
  });

  const inviteMutation = useRegisterWithInvitationMutation();

  function onSubmit(values: RegisterInviteValues) {
    inviteMutation.mutate({
      token: token as string,
      firstName: values.firstName,
      lastName: values.lastName,
      password: values.password,
    });
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-xl border shadow-sm">
        <div className="flex flex-col items-center space-y-4">
          <TaskaLogo iconOnly className="h-12 w-12" />
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">
              {t("auth.acceptInviteTitle", "Join your Workspace")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t(
                "auth.acceptInviteSubtitle",
                "Set up your profile to get started.",
              )}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                {t("auth.firstNameLabel", "First Name")}
              </Label>
              <Input
                id="firstName"
                disabled={inviteMutation.isPending}
                {...register("firstName")}
              />
              {errors.firstName && (
                <p className="text-xs text-destructive">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">
                {t("auth.lastNameLabel", "Last Name")}
              </Label>
              <Input
                id="lastName"
                disabled={inviteMutation.isPending}
                {...register("lastName")}
              />
              {errors.lastName && (
                <p className="text-xs text-destructive">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              {t("auth.passwordLabel", "Password")}
            </Label>
            <Input
              id="password"
              type="password"
              disabled={inviteMutation.isPending}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              {t("auth.confirmPasswordLabel", "Confirm Password")}
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              disabled={inviteMutation.isPending}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full mt-6"
            size="lg"
            disabled={inviteMutation.isPending}
          >
            {inviteMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("common.loading", "Please wait...")}
              </>
            ) : (
              t("auth.joinWorkspaceButton", "Join Workspace")
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
