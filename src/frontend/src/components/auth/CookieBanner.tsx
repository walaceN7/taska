import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Cookie } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function CookieBanner() {
  const { t } = useTranslation();

  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window !== "undefined") {
      return !localStorage.getItem("taska_cookie_consent");
    }
    return false;
  });

  const acceptCookies = () => {
    localStorage.setItem("taska_cookie_consent", "accepted");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 flex justify-center animate-in fade-in slide-in-from-bottom-10 duration-500">
      <Card className="p-4 md:p-6 shadow-2xl border-primary/20 max-w-4xl w-full bg-card/95 backdrop-blur-md flex flex-col md:flex-row items-center gap-4">
        <div className="bg-primary/10 p-3 rounded-full">
          <Cookie className="h-6 w-6 text-primary" />
        </div>

        <div className="flex-1 text-center md:text-left">
          <p className="text-sm text-muted-foreground">
            {t("cookieBanner.message")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsVisible(false)}
          >
            {t("common.cancel")}
          </Button>
          <Button size="sm" onClick={acceptCookies}>
            {t("common.acceptAll")}
          </Button>
        </div>
      </Card>
    </div>
  );
}
