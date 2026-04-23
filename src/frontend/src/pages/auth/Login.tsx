import { CookieBanner } from "@/components/auth/CookieBanner";
import { TaskaLogo } from "@/components/branding/TaskaLogo";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginMutation } from "@/hooks/useAuth";
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

  const [turnstileKey, setTurnstileKey] = useState(0);

  const loginSchema = z.object({
    email: z.email({ message: t("auth.invalidEmail", "Invalid email") }),
    password: z
      .string()
      .min(6, { message: t("auth.passwordMinLength", "Password too short") }),
    rememberMe: z.boolean().optional(),
    turnstileToken: z.string().min(10, "Awaiting security verification..."),
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

  const turnstileToken = useWatch({
    control,
    name: "turnstileToken",
  });

  const hasToken = turnstileToken && turnstileToken.length > 10;
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || "";

  const loginMutation = useLoginMutation();

  function onSubmit(values: LoginFormValues) {
    loginMutation.mutate(
      {
        email: values.email,
        password: values.password,
        turnstileToken: values.turnstileToken,
        rememberMe: values.rememberMe || false,
      },
      {
        onError: (error) => {
          console.error("Login failed:", error);
          setTurnstileKey((prev) => prev + 1);
          setValue("turnstileToken", "", { shouldValidate: true });
        },
      },
    );
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-zinc-950 text-white relative overflow-hidden">
        <div className="relative z-10">
          <TaskaLogo className="h-10" />
        </div>
        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl font-bold leading-tight">
            {t("marketing.heroTitle", "Manage tasks with precision")}
          </h2>
          <p className="text-zinc-400 text-lg max-w-md">
            {t("marketing.heroSubtitle", "The best tool for your team")}
          </p>
        </div>
        <div className="relative z-10 text-sm text-zinc-500">
          {t("common.copyright", "© 2026 Taska")}
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
              {t("auth.loginTitle", "Welcome back")}
            </h1>
            <p className="text-muted-foreground">
              {t("auth.loginSubtitle", "Enter your credentials")}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.emailLabel", "Email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("auth.emailPlaceholder", "name@company.com")}
                disabled={loginMutation.isPending}
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
                <Label htmlFor="password">
                  {t("auth.passwordLabel", "Password")}
                </Label>
                <Link
                  to="/forgot-password"
                  className="font-semibold text-primary text-sm hover:underline"
                >
                  {t("auth.forgotPassword", "Forgot password?")}
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                disabled={loginMutation.isPending}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm font-medium text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  disabled={loginMutation.isPending}
                  {...register("rememberMe")}
                />
                <Label
                  htmlFor="rememberMe"
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  {t("auth.rememberMe", "Remember me")}
                </Label>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={(!hasToken && !!siteKey) || loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("common.loading", "Please wait...")}
                </>
              ) : (
                t("auth.loginButton", "Sign In")
              )}
            </Button>

            {!hasToken && siteKey && (
              <div className="flex items-center justify-center mt-2 text-muted-foreground animate-pulse">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <span className="text-sm font-medium">
                  {t("auth.verifySecurity", "Verifying connection...")}
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

          <p className="text-center text-sm text-muted-foreground">
            {t("auth.noAccount", "Don't have an account?")}{" "}
            <Link
              to="/register"
              className="font-semibold text-primary hover:underline"
            >
              {t("auth.createAccount", "Sign up")}
            </Link>
          </p>
        </div>
      </div>

      <CookieBanner />
    </div>
  );
}
