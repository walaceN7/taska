import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateWithoutTime } from "@/lib/utils";
import { type ProjectDto, ProjectStatus } from "@/types/project.types";
import { Calendar, FolderKanban } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface ProjectCardProps {
  project: ProjectDto;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { t } = useTranslation();

  const getStatusVariant = (status: number) => {
    switch (status) {
      case ProjectStatus.Active:
        return "default";
      case ProjectStatus.Planning:
        return "secondary";
      case ProjectStatus.Completed:
        return "outline";
      default:
        return "destructive";
    }
  };

  const getStatusText = (status: number) => {
    const statusKey = Object.keys(ProjectStatus).find(
      (key) => ProjectStatus[key as keyof typeof ProjectStatus] === status,
    );

    return statusKey
      ? t(`project.status.${statusKey.toLowerCase()}`, statusKey)
      : t("project.status.unknown", "Unknown");
  };

  return (
    <Link to={`/projects/${project.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer border-primary/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-bold">{project.name}</CardTitle>
          <FolderKanban className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {project.companyName}
            </p>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>
                {project.startDate
                  ? formatDateWithoutTime(project.startDate)
                  : "---"}
              </span>
            </div>

            <Badge variant={getStatusVariant(project.status)} className="w-fit">
              {getStatusText(project.status)}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
