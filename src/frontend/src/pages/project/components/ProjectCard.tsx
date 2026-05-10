import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUsersByIds } from "@/hooks/useUser";
import { formatDateWithoutTime } from "@/lib/utils";
import { ProjectStatus, type ProjectDto } from "@/types/project.types";
import { Calendar, FolderKanban, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ProjectMembersModal } from "./ProjectMembersModal";

interface ProjectCardProps {
  project: ProjectDto;
}

const getInitials = (name?: string) => {
  if (!name) return "U";
  const parts = name.split(" ");
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.substring(0, 2).toUpperCase();
};

export function ProjectCard({ project }: ProjectCardProps) {
  const { t } = useTranslation();

  const memberIds = project.members?.map((m) => m.userId) || [];
  const { data: members, isLoading } = useUsersByIds(memberIds);

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

  const maxAvatars = 3;
  const validMembers = members?.filter((m) => memberIds.includes(m.id)) || [];
  const displayMembers = validMembers.slice(0, maxAvatars);
  const remainingMembers = memberIds.length > maxAvatars ? memberIds.length - maxAvatars : 0;

  return (
    <Link to={`/projects/${project.id}`}>
      <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-border/60 hover:border-primary/30 flex flex-col h-full bg-background/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="flex flex-col gap-1 pr-2">
            <CardTitle className="text-lg font-bold truncate tracking-tight">
              {project.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {project.companyName}
            </p>
          </div>
          <FolderKanban className="h-5 w-5 text-muted-foreground/60 shrink-0 mt-1" />
        </CardHeader>

        <CardContent className="flex-1 flex flex-col justify-between pt-2">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {project.startDate
                  ? formatDateWithoutTime(project.startDate)
                  : "---"}
              </span>
            </div>

            <Badge
              variant={getStatusVariant(project.status)}
              className="w-fit shadow-sm"
            >
              {getStatusText(project.status)}
            </Badge>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4">
            <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              {t("team.members", "Members")}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center -space-x-2.5">
                {isLoading ? (
                  <>
                    <Skeleton className="h-8 w-8 rounded-full border-2 border-background" />
                    <Skeleton className="h-8 w-8 rounded-full border-2 border-background" />
                  </>
                ) : (
                  <>
                    {displayMembers.map((member) => (
                      <Avatar
                        key={member.id}
                        className="h-8 w-8 border-2 border-background ring-1 ring-border/20 hover:z-10 transition-transform hover:scale-110 shadow-sm"
                        title={member.fullName}
                      >
                        <AvatarImage
                          src={member.avatarUrl}
                          alt={member.fullName}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                          {getInitials(member.fullName)}
                        </AvatarFallback>
                      </Avatar>
                    ))}

                    {remainingMembers > 0 && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-secondary text-[10px] font-bold text-secondary-foreground z-0 shadow-sm ring-1 ring-border/20">
                        +{remainingMembers}
                      </div>
                    )}
                  </>
                )}
              </div>

              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <ProjectMembersModal
                  projectId={project.id}
                  currentMembers={project.members || []}
                  customTrigger={
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 rounded-full border-dashed border-muted-foreground/40 text-muted-foreground hover:border-primary hover:text-primary transition-colors z-20 shadow-sm"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
