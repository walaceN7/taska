import { TaskaLogo } from "@/components/branding/TaskaLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRegisterMutation } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile } from "@marsidev/react-turnstile";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { z } from "zod";

export function Register() {
  const { t } = useTranslation();
  const [turnstileKey, setTurnstileKey] = useState(0);

  const registerSchema = z.object({
    firstName: z.string().min(2, t("auth.fieldRequired")),
    lastName: z.string().min(2, t("auth.fieldRequired")),
    companyName: z.string().min(2, t("auth.fieldRequired")),
    email: z.string().email(t("auth.invalidEmail")),
    password: z.string().min(6, t("auth.passwordMinLength")),
    plan: z
      .number()
      .int()
      .min(1)
      .max(3, {
        message: t("auth.planRequired"),
      }),
    turnstileToken: z.string().min(10, t("auth.captchaPending")),
  });

  type RegisterFormValues = z.infer<typeof registerSchema>;

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      plan: 1,
    },
  });

  const selectedPlan = useWatch({
    control,
    name: "plan",
  });

  const turnstileToken = useWatch({ control, name: "turnstileToken" });

  const hasToken = turnstileToken && turnstileToken.length > 10;
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || "";

  const registerMutation = useRegisterMutation();

  function onSubmit(values: RegisterFormValues) {
    registerMutation.mutate(
      {
        firstName: values.firstName,
        lastName: values.lastName,
        companyName: values.companyName,
        email: values.email,
        password: values.password,
        planId: values.plan,
        turnstileToken: values.turnstileToken,
      },
      {
        onError: (error) => {
          console.error("Registration failed:", error);
          setTurnstileKey((prev) => prev + 1);
          setValue("turnstileToken", "", { shouldValidate: true });
        },
      },
    );
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="flex items-center justify-center p-8 bg-background overflow-y-auto">
        <div className="w-full max-w-md space-y-8 py-10">
          <div className="text-center lg:text-left space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {t("auth.registerTitle")}
            </h1>
            <p className="text-muted-foreground">
              {t("auth.registerSubtitle")}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">{t("auth.firstNameLabel")}</Label>
                <Input id="firstName" {...register("firstName")} />
                {errors.firstName && (
                  <p className="text-xs text-destructive">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">{t("auth.lastNameLabel")}</Label>
                <Input id="lastName" {...register("lastName")} />
                {errors.lastName && (
                  <p className="text-xs text-destructive">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">{t("auth.companyNameLabel")}</Label>
              <Input
                id="companyName"
                placeholder={t("auth.companyPlaceholder")}
                {...register("companyName")}
              />
              {errors.companyName && (
                <p className="text-xs text-destructive">
                  {errors.companyName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.emailLabel")}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("auth.emailPlaceholder")}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t("auth.passwordLabel")}</Label>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && (
                <p className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-3 pt-2">
              <Label>{t("auth.planLabel")}</Label>
              <RadioGroup
                value={String(selectedPlan)}
                onValueChange={(val) => setValue("plan", Number(val))}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <Label
                  htmlFor="plan-1"
                  className={`relative flex flex-col items-start p-4 border rounded-lg cursor-pointer transition-all hover:bg-accent/50 ${
                    selectedPlan === 1
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-input"
                  }`}
                >
                  <RadioGroupItem
                    value="1"
                    id="plan-1"
                    className="absolute right-4 top-4"
                  />
                  <span className="font-semibold text-base">
                    {t("auth.planFreeTitle")}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1 font-normal">
                    {t("auth.planFreeDesc")}
                  </span>
                </Label>

                <Label
                  htmlFor="plan-2"
                  className={`relative flex flex-col items-start p-4 border rounded-lg cursor-pointer transition-all hover:bg-accent/50 ${
                    selectedPlan === 2
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-input"
                  }`}
                >
                  <RadioGroupItem
                    value="2"
                    id="plan-2"
                    className="absolute right-4 top-4"
                    disabled
                  />
                  <span className="font-semibold text-base">
                    {t("auth.planProTitle")}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1 font-normal">
                    {t("auth.planProDesc")}
                  </span>
                </Label>
                <Label
                  htmlFor="plan-3"
                  className={`relative flex flex-col items-start p-4 border rounded-lg cursor-pointer transition-all hover:bg-accent/50 ${
                    selectedPlan === 3
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-input"
                  }`}
                >
                  <RadioGroupItem
                    value="3"
                    id="plan-3"
                    className="absolute right-4 top-4"
                    disabled
                  />
                  <span className="font-semibold text-base">
                    {t("auth.planEnterpriseTitle")}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1 font-normal">
                    {t("auth.planEnterpriseDesc")}
                  </span>
                </Label>
              </RadioGroup>
              {errors.plan && (
                <p className="text-xs text-destructive">
                  {errors.plan.message}
                </p>
              )}
            </div>

            <div className="pt-2">
              {!hasToken && siteKey && (
                <div className="flex items-center justify-center mb-4 text-muted-foreground animate-pulse">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  <span className="text-sm font-medium">
                    {t("auth.verifySecurity")}
                  </span>
                </div>
              )}

              {siteKey && (
                <div className="flex justify-center mb-4">
                  <Turnstile
                    key={turnstileKey}
                    siteKey={siteKey}
                    onSuccess={(token) =>
                      setValue("turnstileToken", token, {
                        shouldValidate: true,
                      })
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
                <p className="text-sm font-medium text-destructive text-center mb-2">
                  {errors.turnstileToken.message}
                </p>
              )}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={
                  (!hasToken && !!siteKey) || registerMutation.isPending
                }
              >
                {registerMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  t("auth.registerButton")
                )}
              </Button>
            </div>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            {t("auth.hasAccount")}{" "}
            <Link
              to="/login"
              className="font-semibold text-primary hover:underline"
            >
              {t("auth.loginButton")}
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-col justify-between p-12 bg-zinc-950 text-white relative overflow-hidden">
        <div className="relative z-10 flex justify-end">
          <TaskaLogo className="h-10" />
        </div>

        <div className="relative z-10 space-y-6 text-right">
          <h2 className="text-4xl font-bold leading-tight">
            {t("common.everythingYouNeed")}
          </h2>
          <p className="text-zinc-400 text-lg ml-auto max-w-md">
            {t("common.tryForFreeOrBoostYourTeam")}
          </p>
        </div>

        <div className="relative z-10 text-sm text-zinc-500 text-right">
          {t("common.copyright")}
        </div>

        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
      </div>
    </div>
  );
}
