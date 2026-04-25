import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuthStore } from "@/stores/authStore";
import { Bell, Check, Languages, LogOut, Moon, Sun, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export function Topbar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("taska-theme");
      return (savedTheme as "light" | "dark") || "dark";
    }
    return "dark";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("taska-theme", theme);
  }, [theme]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="h-14 border-b px-4 flex items-center gap-4 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <SidebarTrigger />

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              title={t("common.switchLanguage", "Switch Language")}
            >
              <Languages className="h-5 w-5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => i18n.changeLanguage("en")}
              className="flex justify-between cursor-pointer"
            >
              English{" "}
              {i18n.language.startsWith("en") && (
                <Check className="h-4 w-4 ml-2" />
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => i18n.changeLanguage("pt")}
              className="flex justify-between cursor-pointer"
            >
              Português{" "}
              {i18n.language.startsWith("pt") && (
                <Check className="h-4 w-4 ml-2" />
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          title={t("common.toggleTheme", "Toggle Theme")}
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5 text-muted-foreground" />
          ) : (
            <Moon className="h-5 w-5 text-muted-foreground" />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-destructive text-destructive-foreground">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="font-normal flex justify-between items-center">
              <span className="font-semibold">
                {t("notifications.title", "Notifications")}
              </span>
              <span className="text-xs text-primary cursor-pointer hover:underline">
                {t("notifications.markAllRead", "Mark all as read")}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <ScrollArea className="h-[300px] pr-3">
              <div className="flex flex-col gap-1 pb-2">
                <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 min-w-[8px] rounded-full bg-primary" />
                    <span className="font-semibold text-sm">
                      Welcome to Taska!
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground pl-4 warp-break-words whitespace-normal">
                    Your workspace is ready. Let's create your first project.
                  </span>
                  <span className="text-[10px] text-muted-foreground mt-1 pl-4">
                    2 hours ago
                  </span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 min-w-[8px] rounded-full bg-primary" />
                    <span className="font-semibold text-sm">
                      New Feature Assigned
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground pl-4 warp-break-words whitespace-normal">
                    You were assigned to "Implement Drag and Drop".
                  </span>
                  <span className="text-[10px] text-muted-foreground mt-1 pl-4">
                    4 hours ago
                  </span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 min-w-[8px] rounded-full bg-primary" />
                    <span className="font-semibold text-sm">
                      Mention in Comments
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground pl-4 warp-break-words whitespace-normal">
                    John Doe mentioned you in "Fix navigation bug".
                  </span>
                  <span className="text-[10px] text-muted-foreground mt-1 pl-4">
                    1 day ago
                  </span>
                </DropdownMenuItem>
              </div>
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-9 w-9 rounded-full ml-2"
            >
              <Avatar className="h-9 w-9 border">
                <AvatarImage src={user?.avatarUrl} alt={user?.fullName} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {getInitials(user?.fullName)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.fullName}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>{t("nav.profile", "Profile")}</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t("auth.logout", "Log out")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
