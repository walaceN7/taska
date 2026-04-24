import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";

export function MainLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <AppSidebar />

        <main className="flex-1 flex flex-col">
          <header className="h-14 border-b px-4 flex items-center gap-4 bg-card/50 backdrop-blur-sm">
            <SidebarTrigger />
            <div className="flex-1" />
          </header>

          <div className="p-6 flex-1 overflow-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
