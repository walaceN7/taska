import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePagedBoards } from "@/hooks/useBoard";
import { useProject } from "@/hooks/useProject";
import { ProjectStatus } from "@/types/project.types";
import { ArrowLeft, LayoutTemplate, Settings, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { BoardCard } from "./components/BoardCard";
import { CreateBoardModal } from "./components/CreateBoardModal";

export function ProjectDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();

  const { data: project, isLoading: isProjectLoading } = useProject(projectId!);

  const { data: boardsData, isLoading: isBoardsLoading } = usePagedBoards(
    projectId!,
    0,
    10,
  );

  if (isProjectLoading) {
    return <ProjectDashboardSkeleton />;
  }

  if (!project) {
    return <div>{t("project.notFound", "Project not found.")}</div>;
  }

  const getProjectStatusLabel = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.Planning:
        return t("project.status.planning", "Planning");
      case ProjectStatus.Active:
        return t("project.status.active", "Active");
      case ProjectStatus.OnHold:
        return t("project.status.onHold", "On Hold");
      case ProjectStatus.Completed:
        return t("project.status.completed", "Completed");
      case ProjectStatus.Cancelled:
        return t("project.status.cancelled", "Cancelled");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/projects")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
          <p className="text-muted-foreground">
            {project.companyName} • {getProjectStatusLabel(project.status)}
          </p>
        </div>
      </div>

      <Tabs defaultValue="boards" className="space-y-6">
        <TabsList className="bg-background border">
          <TabsTrigger
            value="boards"
            className="data-[state=active]:bg-primary/10"
          >
            <LayoutTemplate className="mr-2 h-4 w-4" />
            {t("project.tabs.boards", "Boards")}
          </TabsTrigger>
          <TabsTrigger
            value="members"
            className="data-[state=active]:bg-primary/10"
          >
            <Users className="mr-2 h-4 w-4" />
            {t("project.tabs.members", "Members")}
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="data-[state=active]:bg-primary/10"
          >
            <Settings className="mr-2 h-4 w-4" />
            {t("project.tabs.settings", "Settings")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="boards" className="space-y-4 outline-none">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold tracking-tight">
              {t("boards.title", "Project Boards")}
            </h2>
            <CreateBoardModal />
          </div>

          {isBoardsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Skeleton className="h-[120px] w-full rounded-xl" />
              <Skeleton className="h-[120px] w-full rounded-xl" />
            </div>
          ) : boardsData?.items.length === 0 ? (
            <div className="text-center py-10 border rounded-md border-dashed text-muted-foreground">
              {t("boards.empty", "No boards found. Create your first board!")}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {boardsData?.items.map((board) => (
                <BoardCard key={board.id} board={board} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent
          value="members"
          className="outline-none border rounded-md p-6 bg-card text-center text-muted-foreground"
        >
          {t(
            "project.membersPlaceholder",
            "Project members management will be implemented here.",
          )}
        </TabsContent>
        <TabsContent
          value="settings"
          className="outline-none border rounded-md p-6 bg-card text-center text-muted-foreground"
        >
          {t(
            "project.settingsPlaceholder",
            "Project settings will be implemented here.",
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProjectDashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-[250px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
      </div>
      <Skeleton className="h-12 w-[300px]" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-[120px] w-full rounded-xl" />
        <Skeleton className="h-[120px] w-full rounded-xl" />
      </div>
    </div>
  );
}
