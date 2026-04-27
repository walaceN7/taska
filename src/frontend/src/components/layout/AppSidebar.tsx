import { TaskaLogo } from "@/components/branding/TaskaLogo";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/stores/authStore";
import {
  Briefcase,
  CheckSquare,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

export function AppSidebar() {
  const { t } = useTranslation();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  const mainNavItems = [
    {
      title: t("nav.dashboard", "Dashboard"),
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    { title: t("nav.projects", "Projects"), url: "/projects", icon: Briefcase },
    { title: t("nav.myTasks", "My Tasks"), url: "/tasks", icon: CheckSquare },
  ];

  const adminNavItems = [
    { title: t("nav.team", "Team & Members"), url: "/team", icon: Users },
    { title: t("nav.settings", "Settings"), url: "/settings", icon: Settings },
  ];

  const isCompanyAdmin =
    user?.systemRole === "CompanyAdmin" || user?.systemRole === "SaasAdmin";

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <TaskaLogo className="h-8" />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {t("nav.mainMenu", "Main Menu")}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname.startsWith(item.url)}
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isCompanyAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>
              {t("nav.administration", "Administration")}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname.startsWith(item.url)}
                    >
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
