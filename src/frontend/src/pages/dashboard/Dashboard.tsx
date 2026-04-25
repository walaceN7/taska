import { useTranslation } from "react-i18next";

export function Dashboard() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">
        {t("nav.dashboard", "Dashboard")}
      </h1>

      <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
        <p className="text-muted-foreground">
          {t("dashboard.welcome", "Welcome to your workspace!")}
        </p>
      </div>
    </div>
  );
}
