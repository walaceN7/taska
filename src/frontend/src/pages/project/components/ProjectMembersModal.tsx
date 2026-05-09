import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAddProjectMember,
  useProject,
  useRemoveProjectMember,
  useUpdateProjectMemberRole,
} from "@/hooks/useProject";
import { useSearchCompanyMembers, useUsersByIds } from "@/hooks/useUser";
import { ProjectRole, type ProjectMemberResult } from "@/types/project.types";
import { Loader2, Search, UserMinus, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface ProjectMembersModalProps {
  projectId: string;
  currentMembers: ProjectMemberResult[];
  customTrigger: React.ReactNode;
}

export function ProjectMembersModal({
  projectId,
  currentMembers: initialMembers,
  customTrigger,
}: ProjectMembersModalProps) {
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data: searchData,
    isLoading: isSearching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSearchCompanyMembers(debouncedSearchTerm);

  const { data: projectDetails } = useProject(projectId);

  const actualMembers = projectDetails?.members || initialMembers;

  const currentMemberIds = actualMembers.map((m) => m.userId);
  const { data: activeMembersDetails, isLoading: isLoadingActive } =
    useUsersByIds(currentMemberIds);
  const addMemberMutation = useAddProjectMember();
  const removeMemberMutation = useRemoveProjectMember();
  const updateRoleMutation = useUpdateProjectMemberRole();

  const availableToInvite =
    searchData?.pages
      .flatMap((page) => page.items)
      .filter((user) => !actualMembers.some((pm) => pm.userId === user.id)) ||
    [];

  const handleAdd = (userId: string, role: ProjectRole) => {
    addMemberMutation.mutate({ projectId, userId, role });
  };

  const handleRemove = (userId: string) => {
    removeMemberMutation.mutate({ projectId, userId });
  };

  const handleUpdateRole = (userId: string, newRole: ProjectRole) => {
    updateRoleMutation.mutate({
      projectId,
      userId,
      role: newRole,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{customTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {t("project.tabs.members", "Project Members")}
          </DialogTitle>
          <DialogDescription>
            {t(
              "project.manageMembersDesc",
              "Add or remove members and define their roles.",
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t(
                  "project.membersSearch",
                  "Search to add members...",
                )}
                className="pl-8 bg-muted/50 border-transparent focus-visible:ring-1"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <ScrollArea className="h-36 rounded-md border p-2 bg-background">
              {isSearching ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="animate-spin text-muted-foreground" />
                </div>
              ) : availableToInvite.length === 0 ? (
                <div className="text-xs text-center text-muted-foreground mt-4 py-4">
                  {searchTerm
                    ? t("project.noUsersFound", "No users found.")
                    : t(
                        "project.noMembersToAdd",
                        "All members are in the project.",
                      )}
                </div>
              ) : (
                <div className="space-y-1">
                  {availableToInvite.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-1.5 hover:bg-muted/50 rounded-md transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={user.avatarUrl} />
                          <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                            {user.fullName.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium truncate max-w-80">
                          {user.fullName}
                        </span>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 text-primary hover:text-primary hover:bg-primary/10"
                            disabled={addMemberMutation.isPending}
                          >
                            <UserPlus className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem
                            onClick={() =>
                              handleAdd(user.id, ProjectRole.Manager)
                            }
                          >
                            {t("project.role.manager", "Add as Manager")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleAdd(user.id, ProjectRole.Developer)
                            }
                          >
                            {t("project.role.developer", "Add as Developer")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleAdd(user.id, ProjectRole.Viewer)
                            }
                          >
                            {t("project.role.viewer", "Add as Viewer")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}

                  {hasNextPage && (
                    <div className="pt-2 pb-1 flex justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                      >
                        {isFetchingNextPage ? (
                          <Loader2 className="h-3 w-3 animate-spin mr-2" />
                        ) : null}
                        {t("common.loadMore", "Load more")}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
          </div>

          <div className="space-y-2 border-t pt-4">
            <h4 className="text-sm font-semibold">
              {t("team.tabs.active", "Active Members")}
            </h4>
            <ScrollArea className="h-32 rounded-md border p-2 bg-background">
              {isLoadingActive ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="animate-spin text-muted-foreground" />
                </div>
              ) : activeMembersDetails?.length === 0 ? (
                <p className="text-xs text-center text-muted-foreground mt-4 py-4">
                  {t("team.noMembers", "No members in this project.")}
                </p>
              ) : (
                <div className="space-y-1">
                  {activeMembersDetails?.map((user) => {
                    const projectInfo = actualMembers.find(
                      (m) => m.userId === user.id,
                    );
                    return (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-1.5 hover:bg-muted/50 rounded-md transition-colors group"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarImage src={user.avatarUrl} />
                            <AvatarFallback className="text-xs bg-primary/10 text-primary">
                              {user.fullName.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium max-w-80">
                            {user.fullName}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {projectInfo && (
                            <Select
                              defaultValue={String(projectInfo.role)}
                              onValueChange={(v) =>
                                handleUpdateRole(
                                  user.id,
                                  Number(v) as ProjectRole,
                                )
                              }
                            >
                              <SelectTrigger className="h-7 w-[150px] text-xs border-transparent bg-transparent hover:bg-muted focus:ring-0">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={String(ProjectRole.Manager)}>
                                  {t("project.role.manager", "Manager")}
                                </SelectItem>
                                <SelectItem
                                  value={String(ProjectRole.Developer)}
                                >
                                  {t("project.role.developer", "Developer")}
                                </SelectItem>
                                <SelectItem value={String(ProjectRole.Viewer)}>
                                  {t("project.role.viewer", "Viewer")}
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          )}

                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 transition-all"
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
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
