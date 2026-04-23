import { CookieBanner } from "@/components/auth/CookieBanner";
import { TaskaLogo } from "@/components/branding/TaskaLogo";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGoogleLoginMutation, useLoginMutation } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile } from "@marsidev/react-turnstile";
import { useGoogleLogin } from "@react-oauth/google";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { toast } from "sonner";
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
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
      turnstileToken: "",
    },
  });

  const turnstileToken = useWatch({
    control,
    name: "turnstileToken",
  });

  const rememberMe = useWatch({
    control,
    name: "rememberMe",
  });

  const hasToken = turnstileToken && turnstileToken.length > 10;
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || "";

  const loginMutation = useLoginMutation();
  const googleMutation = useGoogleLoginMutation();

  const googleLogin = useGoogleLogin({
    onSuccess: (codeResponse) => {
      googleMutation.mutate({ accessToken: codeResponse.access_token });
    },
    onError: (error) => {
      console.error("Google Login Failed:", error);
      toast.error(
        t("auth.googleLoginFailed", "Failed to authenticate with Google."),
      );
    },
  });

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
                  checked={rememberMe ?? false}
                  onCheckedChange={(checked) =>
                    setValue("rememberMe", checked as boolean)
                  }
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

          <div className="relative mt-6 mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {t("common.orContinueWith", "Or continue with")}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Button
              variant="outline"
              className="w-full"
              type="button"
              onClick={() => googleLogin()}
            >
              <svg
                role="img"
                viewBox="0 0 24 24"
                className="mr-2 h-4 w-4"
                fill="currentColor"
              >
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
              </svg>
              {t("auth.googleLogin", "Continue with Google")}
            </Button>
          </div>

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
