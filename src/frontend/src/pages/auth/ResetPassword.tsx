import { TaskaLogo } from "@/components/branding/TaskaLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";

export function ResetPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const schema = z
    .object({
      password: z.string().min(6, t("auth.passwordMinLength")),
      confirmPassword: z.string().min(6),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("auth.passwordMismatch"),
      path: ["confirmPassword"],
    });

  type ResetValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetValues>({
    resolver: zodResolver(schema),
  });

  function onSubmit(values: ResetValues) {
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      alert("Invalid or missing reset link parameters.");
      return;
    }

    const payload = {
      email: email,
      token: token,
      newPassword: values.password,
    };

    console.log("Enviando para a API:", payload);

    // Futuramente: await api.post('/auth/reset-password', payload);

    alert("Password reset successfully!");
    navigate("/login");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <TaskaLogo iconOnly className="h-12 w-12" />
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">
              {t("auth.resetPasswordTitle")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("auth.resetPasswordSubtitle")}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">{t("auth.newPasswordLabel")}</Label>
            <Input id="password" type="password" {...register("password")} />
            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              {t("auth.confirmPasswordLabel")}
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" size="lg">
            {t("auth.resetButton")}
          </Button>
        </form>
      </div>
    </div>
  );
}
