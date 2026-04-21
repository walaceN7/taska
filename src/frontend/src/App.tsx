import { Button } from "@/components/ui/button";
import { Languages, LayoutGrid, Palette } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TaskaLogo } from "./components/branding/TaskaLogo";

export default function App() {
  const { t, i18n } = useTranslation();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDark]);

  const toggleLanguage = () => {
    const nextLang = i18n.language === "en" ? "pt" : "en";
    i18n.changeLanguage(nextLang);
  };

  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center space-y-12 bg-background text-foreground transition-colors duration-300">
      <div className="w-full max-w-7xl flex items-center justify-between p-4 border rounded-2xl bg-card">
        <div className="flex items-center gap-3">
          <TaskaLogo className="h-10" />
        </div>

        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={toggleLanguage}>
            <Languages className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDark(!isDark)}
          >
            <Palette className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="text-center space-y-4 max-w-2xl">
        <LayoutGrid className="h-16 w-16 text-primary mx-auto opacity-20" />
        <h2 className="text-5xl font-extrabold tracking-tight">
          {t("common.loading")}
        </h2>
        <p className="text-xl text-muted-foreground">
          {t("auth.loginTitle")}. O melhor Kanban do mercado está quase pronto
          para você.
        </p>
      </div>

      <div className="flex gap-4">
        <Button size="lg">{t("auth.loginButton")}</Button>

        <Button variant="secondary" size="lg">
          {t("common.save")}
        </Button>
      </div>
    </div>
  );
}
