import { CookieBanner } from "@/components/auth/CookieBanner";
import { TaskaLogo } from "@/components/branding/TaskaLogo";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile } from "@marsidev/react-turnstile";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { z } from "zod";

export function Login() {
  const { t } = useTranslation();
  const login = useAuthStore((state) => state.login);
  const [turnstileKey, setTurnstileKey] = useState(0);

  const loginSchema = z.object({
    email: z.string().email({ message: t("auth.invalidEmail") }),
    password: z.string().min(6, { message: t("auth.passwordMinLength") }),
    rememberMe: z.boolean().optional(),
    turnstileToken: z
      .string()
      .min(10, "Aguardando verificação de segurança..."),
  });

  type LoginFormValues = z.infer<typeof loginSchema>;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  function onSubmit(values: LoginFormValues) {
    try {
      console.log("Valores prontos para a API:", values);

      // O payload que vai pro C# será:
      // {
      //   email: values.email,
      //   password: values.password,
      //   turnstileToken: values.turnstileToken,
      //   rememberMe: values.rememberMe || false
      // }

      login();
    } catch (error) {
      setTurnstileKey((prev) => prev + 1);
      setValue("turnstileToken", "");
      console.error("Erro ao fazer login:", error);
    }
  }

  const turnstileToken = useWatch({
    control,
    name: "turnstileToken",
  });

  const hasToken = turnstileToken && turnstileToken.length > 10;
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || "";

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-zinc-950 text-white relative overflow-hidden">
        <div className="relative z-10">
          <TaskaLogo className="h-10" />
        </div>

        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl font-bold leading-tight">
            {t("marketing.heroTitle")}
          </h2>
          <p className="text-zinc-400 text-lg max-w-md">
            {t("marketing.heroSubtitle")}
          </p>
        </div>

        <div className="relative z-10 text-sm text-zinc-500">
          {t("common.copyright")}
        </div>

        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
      </div>

      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-sm space-y-8">
          <div className="flex justify-center lg:hidden mb-4">
            <TaskaLogo className="h-10" />
          </div>

          <div className="text-center lg:text-left space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {t("auth.loginTitle")}
            </h1>
            <p className="text-muted-foreground">{t("auth.loginSubtitle")}</p>
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
                <p className="text-sm font-medium text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">{t("auth.passwordLabel")}</Label>
                <Link
                  to="/forgot-password"
                  className="font-semibold text-primary text-sm hover:underline"
                >
                  {t("auth.forgotPassword")}
                </Link>
              </div>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && (
                <p className="text-sm font-medium text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="rememberMe" {...register("rememberMe")} />
                  <Label
                    htmlFor="rememberMe"
                    className="text-sm font-medium leading-none"
                  >
                    {t("auth.rememberMe")}
                  </Label>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={!hasToken && !!siteKey}
            >
              {t("auth.loginButton")}
            </Button>
            {!hasToken && siteKey && (
              <div className="flex items-center justify-center mt-2 text-muted-foreground animate-pulse">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <span className="text-sm font-medium">
                  {t("auth.verifySecurity")}
                </span>
              </div>
            )}

            {siteKey && (
              <div className="flex justify-center mt-4">
                <Turnstile
                  key={turnstileKey}
                  siteKey={siteKey}
                  onSuccess={(token) =>
                    setValue("turnstileToken", token, { shouldValidate: true })
                  }
                  onExpire={() =>
                    setValue("turnstileToken", "", { shouldValidate: true })
                  }
                  onError={() =>
                    setValue("turnstileToken", "", { shouldValidate: true })
                  }
                />
              </div>
            )}
            {errors.turnstileToken && (
              <p className="text-sm font-medium text-destructive text-center">
                {errors.turnstileToken.message}
              </p>
            )}
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {t("common.orContinueWith")}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Button variant="outline" className="w-full" type="button">
              Google
            </Button>
            <Button variant="outline" className="w-full" type="button">
              Microsoft
            </Button>
            <Button variant="outline" className="w-full" type="button">
              Apple
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            {t("auth.noAccount")}{" "}
            <Link
              to="/register"
              className="font-semibold text-primary hover:underline"
            >
              {t("auth.createAccount")}
            </Link>
          </p>
        </div>
      </div>

      <CookieBanner />
    </div>
  );
}
