import { Button } from "@/components/ui/button";
import { useInfiniteProjects } from "@/hooks/useProject";
import { LayoutGrid, List, Loader2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CreateProjectModal } from "./components/CreateProjectModal";
import { ProjectCard } from "./components/ProjectCard";

export function Projects() {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteProjects(6);

  const allProjects = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("projects.title", "Projects")}
          </h1>
          <p className="text-muted-foreground">
            {t("projects.subtitle", "Manage your workspace projects.")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-md mr-4">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("table")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          <CreateProjectModal />
        </div>
      </header>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {viewMode === "grid" ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>

              {hasNextPage && (
                <div className="flex justify-center pt-4">
                  <Button
                    variant="outline"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                  >
                    {isFetchingNextPage ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      t("common.loadMore", "Load More")
                    )}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-md border p-4 bg-card">
              <p className="text-center text-muted-foreground py-10">
                {t(
                  "projects.tablePlaceholder",
                  "Projects table (Implement columns later)",
                )}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
