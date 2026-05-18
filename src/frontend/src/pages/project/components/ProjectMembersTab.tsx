import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useRemoveProjectMember,
  useUpdateProjectMemberRole,
} from "@/hooks/useProject";
import { useUsersByIds } from "@/hooks/useUser";
import { ProjectRole, type ProjectMemberResult } from "@/types/project.types";
import { Loader2, UserMinus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ProjectMembersModal } from "./ProjectMembersModal";

interface ProjectMembersTabProps {
  projectId: string;
  members: ProjectMemberResult[];
}

export function ProjectMembersTab({
  projectId,
  members,
}: ProjectMembersTabProps) {
  const { t } = useTranslation();

  const memberIds = members.map((m) => m.userId);
  const { data: usersDetails, isLoading } = useUsersByIds(memberIds);

  const removeMemberMutation = useRemoveProjectMember();
  const updateRoleMutation = useUpdateProjectMemberRole();

  const handleUpdateRole = (userId: string, newRole: ProjectRole) => {
    updateRoleMutation.mutate({ projectId, userId, role: newRole });
  };

  const handleRemove = (userId: string) => {
    removeMemberMutation.mutate({ projectId, userId });
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-5 rounded-xl border shadow-sm">
        <div>
          <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
            {t("project.membersManagement", "Members Management")}
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {members.length}
            </Badge>
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {t(
              "project.manageMembersDesc",
              "Add or remove members and define their roles.",
            )}
          </p>
        </div>

        <ProjectMembersModal
          projectId={projectId}
          currentMembers={members}
          customTrigger={
            <Button>{t("project.addMember", "Add Member")}</Button>
          }
        />
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : members.length === 0 ? (
          <div className="flex justify-center items-center h-40 text-muted-foreground border-dashed border-2 m-4 rounded-lg">
            {t("team.noMembers", "No members in this project.")}
          </div>
        ) : (
          <div className="divide-y">
            {members.map((memberInfo) => {
              const user = usersDetails?.find(
                (u) => u.id === memberInfo.userId,
              );
              if (!user) return null;

              return (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10 border shadow-sm">
                      <AvatarImage src={user.avatarUrl} />
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {getInitials(user.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">
                        {user.fullName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Select
                      defaultValue={String(memberInfo.role)}
                      onValueChange={(v) =>
                        handleUpdateRole(user.id, Number(v) as ProjectRole)
                      }
                      disabled={updateRoleMutation.isPending}
                    >
                      <SelectTrigger className="h-9 w-35 text-sm bg-transparent border-input hover:bg-muted focus:ring-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={String(ProjectRole.Manager)}>
                          {t("project.role.manager", "Manager")}
                        </SelectItem>
                        <SelectItem value={String(ProjectRole.Developer)}>
                          {t("project.role.developer", "Developer")}
                        </SelectItem>
                        <SelectItem value={String(ProjectRole.Viewer)}>
                          {t("project.role.viewer", "Viewer")}
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      disabled={removeMemberMutation.isPending}
                      onClick={() => handleRemove(user.id)}
                      title={t("common.remove", "Remove")}
                    >
                      <UserMinus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
