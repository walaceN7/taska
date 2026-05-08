import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUsersByIds } from "@/hooks/useUser";
import { formatDateWithoutTime } from "@/lib/utils";
import { type ProjectDto, ProjectStatus } from "@/types/project.types";
import { Calendar, FolderKanban } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

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
  const displayMembers = members?.slice(0, maxAvatars) || [];
  const remainingMembers = (members?.length || 0) - maxAvatars;

  return (
    <Link to={`/projects/${project.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer border-primary/10 flex flex-col h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-bold truncate pr-2">
            {project.name}
          </CardTitle>
          <FolderKanban className="h-5 w-5 text-muted-foreground shrink-0" />
        </CardHeader>

        <CardContent className="flex-1 flex flex-col justify-between">
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

          <div className="mt-4 flex items-center justify-between border-t pt-4">
            <div className="text-xs text-muted-foreground font-medium">
              {t("team.members", "Members")}
            </div>

            <div className="flex items-center -space-x-2">
              {isLoading ? (
                <>
                  <Skeleton className="h-8 w-8 rounded-full border-2 border-background" />
                  <Skeleton className="h-8 w-8 rounded-full border-2 border-background" />
                </>
              ) : (
                <>
                  {displayMembers.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      {t("team.noMembers", "No members")}
                    </p>
                  )}

                  {displayMembers.map((member) => (
                    <Avatar
                      key={member.id}
                      className="h-8 w-8 border-2 border-background hover:z-10 transition-transform hover:scale-110"
                      title={member.fullName}
                    >
                      <AvatarImage
                        src={member.avatarUrl}
                        alt={member.fullName}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-semibold">
                        {getInitials(member.fullName)}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {remainingMembers > 0 && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-medium text-muted-foreground z-0">
                      +{remainingMembers}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
