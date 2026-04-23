import { TaskaLogo } from "@/components/branding/TaskaLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { z } from "zod";

export function ForgotPassword() {
  const { t } = useTranslation();

  const schema = z.object({
    email: z.string().email(t("auth.invalidEmail")),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>({
    resolver: zodResolver(schema),
  });

  function onSubmit(values: { email: string }) {
    console.log("Solicitando reset para:", values.email);
    alert("Check your email for the reset link!");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <TaskaLogo iconOnly className="h-12 w-12" />
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">
              {t("auth.forgotPasswordTitle")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("auth.forgotPasswordSubtitle")}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t("auth.emailLabel")}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t("auth.emailPlaceholder")}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" size="lg">
            {t("auth.sendLinkButton")}
          </Button>
        </form>

        <Link
          to="/login"
          className="flex items-center justify-center text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          {t("auth.backToLogin")}
        </Link>
      </div>
    </div>
  );
}
