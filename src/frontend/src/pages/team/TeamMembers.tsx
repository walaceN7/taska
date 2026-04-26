import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useCompanyMembers,
  usePendingInvites,
  useTeams,
} from "@/hooks/useTeam";
import { formatDate } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import {
  Clock,
  Mail,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Shield,
  ShieldAlert,
  Trash2,
  UserCog,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { CreateTeamModal } from "./components/CreateTeamModal";
import { InviteMemberModal } from "./components/InviteMemberModal";

export function TeamMembers() {
  const { t } = useTranslation();

  const { user } = useAuthStore();

  const {
    data: activeMembers = [],
    isLoading: isLoadingMembers,
    isFetching: isFetchingMembers,
    refetch: refetchMembers,
    dataUpdatedAt: membersUpdatedAt,
  } = useCompanyMembers();

  const {
    data: pendingInvites = [],
    isLoading: isLoadingInvites,
    isFetching: isFetchingInvites,
    refetch: refetchInvites,
    dataUpdatedAt: invitesUpdatedAt,
  } = usePendingInvites();

  const {
    data: teams = [],
    isLoading: isLoadingTeams,
    isFetching: isFetchingTeams,
    refetch: refetchTeams,
    dataUpdatedAt: teamsUpdatedAt,
  } = useTeams();

  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  const handleRefresh = () => {
    refetchMembers();
    refetchInvites();
    refetchTeams();
  };

  const lastUpdated =
    membersUpdatedAt || invitesUpdatedAt || teamsUpdatedAt
      ? new Date(
          Math.max(membersUpdatedAt, invitesUpdatedAt, teamsUpdatedAt),
        ).toISOString()
      : undefined;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("team.title", "Workspace Team")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t(
              "team.subtitle",
              "Manage members, roles, and pending invitations.",
            )}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={
                isFetchingMembers || isFetchingInvites || isFetchingTeams
              }
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isFetchingMembers || isFetchingInvites || isFetchingTeams ? "animate-spin" : ""}`}
              />
              {t("common.refresh", "Refresh")}
            </Button>

            <InviteMemberModal />
          </div>

          {lastUpdated && (
            <span className="text-[10px] text-muted-foreground mr-1">
              {t("common.lastUpdated", "Updated:")} {formatDate(lastUpdated)}
            </span>
          )}
        </div>
      </header>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-[500px]">
          <TabsTrigger value="active">
            {t("team.tabs.active", "Active Members")}
            <Badge
              variant="secondary"
              className="ml-2 bg-primary/10 text-primary"
            >
              {activeMembers.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="pending">
            {t("team.tabs.pending", "Pending Invites")}
            {pendingInvites.length > 0 && (
              <Badge
                variant="secondary"
                className="ml-2 bg-primary/10 text-primary"
              >
                {pendingInvites.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="teams">
            {t("team.tabs.teams", "Teams")}
            {teams.length > 0 && (
              <Badge
                variant="secondary"
                className="ml-2 bg-primary/10 text-primary"
              >
                {teams.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead>{t("team.user", "User")}</TableHead>
                  <TableHead>{t("team.role", "Role")}</TableHead>
                  <TableHead className="text-right">
                    {t("team.actions", "Actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoadingMembers ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="flex items-center gap-3 py-4">
                        <Skeleton className="h-9 w-9 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[150px]" />
                          <Skeleton className="h-3 w-[100px]" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[80px]" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-8 w-8 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : activeMembers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="h-32 text-center text-muted-foreground"
                    >
                      {t(
                        "team.noActiveMembers",
                        "No active members found in this workspace.",
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  activeMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="flex items-center gap-3 py-4">
                        <Avatar className="h-9 w-9 border">
                          <AvatarImage
                            src={member.avatarUrl}
                            alt={member.fullName}
                          />
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {getInitials(member.fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium leading-none">
                            {member.fullName}
                          </span>
                          <span className="text-sm text-muted-foreground mt-1">
                            {member.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {member.systemRole === "CompanyAdmin" ? (
                            <ShieldAlert className="h-4 w-4 text-primary" />
                          ) : (
                            <UserCog className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span
                            className={
                              member.systemRole === "CompanyAdmin"
                                ? "font-medium"
                                : "text-muted-foreground"
                            }
                          >
                            {member.systemRole === "CompanyAdmin"
                              ? "Admin"
                              : "Member"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground"
                              disabled={member.id === user?.userId}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>
                              {t("team.manageAccess", "Manage Access")}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer">
                              <Shield className="mr-2 h-4 w-4" />
                              {t("team.makeAdmin", "Make Admin")}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <UserCog className="mr-2 h-4 w-4" />
                              {t("team.makeMember", "Make Member")}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              {t("team.removeMember", "Remove from Workspace")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead>{t("team.email", "Email Address")}</TableHead>
                  <TableHead>{t("team.status", "Status")}</TableHead>
                  <TableHead className="text-right">
                    {t("team.actions", "Actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingInvites ? (
                  Array.from({ length: 2 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="py-4">
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[200px]" />
                          <Skeleton className="h-3 w-[120px]" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-[80px] rounded-full" />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Skeleton className="h-8 w-[80px]" />
                          <Skeleton className="h-8 w-[80px]" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : pendingInvites.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="h-32 text-center text-muted-foreground"
                    >
                      {t("team.noPendingInvites", "No pending invitations.")}
                    </TableCell>
                  </TableRow>
                ) : (
                  pendingInvites.map((invite) => (
                    <TableRow key={invite.id}>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2 font-medium">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {invite.email}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {t("team.sent", "Sent")} {formatDate(invite.sentAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="text-amber-500 border-amber-500/30 bg-amber-500/10"
                        >
                          {t("team.statusPending", "Pending")}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">
                          {t("team.expires", "Expires")}{" "}
                          {formatDate(invite.expiresAt)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            {t("team.resendInvite", "Resend")}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            {t("common.cancel", "Cancel")}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="teams" className="space-y-4">
          <div className="flex justify-between items-center bg-card p-4 rounded-xl border shadow-sm">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                {t("team.tabs.teams", "Teams")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t(
                  "team.teamsSubtitle",
                  "Organize members into functional groups.",
                )}
              </p>
            </div>
            <CreateTeamModal />
          </div>

          <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead>{t("team.name", "Team Name")}</TableHead>
                  <TableHead>{t("team.memberCount", "Member Count")}</TableHead>
                  <TableHead className="text-right">
                    {t("team.actions", "Actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingTeams ? (
                  Array.from({ length: 2 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="py-4">
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[200px]" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-[80px] rounded-full" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-8 w-8 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : teams.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="h-48 text-center text-muted-foreground"
                    >
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-lg font-semibold text-foreground">
                            {t("team.noTeamsTitle", "No teams created yet")}
                          </h3>
                          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                            {t(
                              "team.noTeamsDesc",
                              "Organize your members into teams like 'Frontend', 'Marketing', or 'Design'.",
                            )}
                          </p>
                        </div>
                        <div className="mt-4">
                          <CreateTeamModal
                            customTrigger={
                              <Button variant="outline">
                                <Plus className="mr-2 h-4 w-4" />
                                {t("team.createTeam", "Create Team")}
                              </Button>
                            }
                          />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  teams.map((team) => (
                    <TableRow key={team.id}>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3 font-medium">
                          <div className="bg-primary/10 p-2 rounded-md">
                            <Users className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex flex-col">
                            <span>{team.name}</span>
                            {team.description && (
                              <span className="text-xs text-muted-foreground font-normal">
                                {team.description}
                              </span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="bg-primary/10 text-primary"
                        >
                          {team.memberCount} {t("team.membersCount", "members")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem className="cursor-pointer">
                              <UserCog className="mr-2 h-4 w-4" />
                              {t("team.manageMembers", "Manage")}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              {t("common.delete", "Delete")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
