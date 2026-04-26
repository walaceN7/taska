import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { usePagedProjects } from "@/hooks/useProject";
import type { PaginationState } from "@tanstack/react-table";
import { LayoutGrid, List, Loader2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useProjectColumns } from "./columns/project-columns";
import { CreateProjectModal } from "./components/CreateProjectModal";
import { ProjectCard } from "./components/ProjectCard";

export function Projects() {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const columns = useProjectColumns();

  const { data, isLoading } = usePagedProjects(
    pagination.pageIndex,
    pagination.pageSize,
  );

  const projects = data?.items ?? [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
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
        <div className="space-y-8">
          {viewMode === "grid" ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>

              {data && data.totalPages > 1 && (
                <div className="flex items-center justify-between px-2">
                  <div className="text-sm text-muted-foreground">
                    {t("common.pageInfo", {
                      current: data.pageNumber,
                      total: data.totalPages,
                      defaultValue: `Page ${data.pageNumber} of ${data.totalPages}`,
                    })}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          pageIndex: prev.pageIndex - 1,
                        }))
                      }
                      disabled={!data.hasPreviousPage}
                    >
                      {t("common.previous", "Previous")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          pageIndex: prev.pageIndex + 1,
                        }))
                      }
                      disabled={!data.hasNextPage}
                    >
                      {t("common.next", "Next")}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-md border bg-card">
              {/* Agora o DataTable recebe todas as props que ele exige! */}
              <DataTable
                columns={columns}
                data={projects}
                pageCount={data?.totalPages ?? 0}
                pagination={pagination}
                onPaginationChange={setPagination}
                totalCount={data?.totalCount ?? 0}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
