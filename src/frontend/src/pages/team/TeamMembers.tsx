import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  usePagedCompanyMembers,
  usePagedPendingInvites,
  usePagedTeams,
} from "@/hooks/useTeam";
import { formatDate } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { Mail, Plus, RefreshCw, UserCog, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { getActiveMembersColumns } from "./columns/active-members-columns";
import { getPendingInvitesColumns } from "./columns/pending-invites-columns";
import { getTeamColumns } from "./columns/team-columns";
import { CreateTeamModal } from "./components/CreateTeamModal";
import { InviteMemberModal } from "./components/InviteMemberModal";

export function TeamMembers() {
  const { t } = useTranslation();
  const { user } = useAuthStore();

  const [membersPagination, setMembersPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const [invitesPagination, setInvitesPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const [teamsPagination, setTeamsPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const activeMembersColumns = useMemo(
    () => getActiveMembersColumns(t, user?.userId),
    [t, user?.userId],
  );
  const pendingInvitesColumns = useMemo(() => getPendingInvitesColumns(t), [t]);
  const teamColumns = useMemo(() => getTeamColumns(t), [t]);

  const {
    data: pagedActiveMembers,
    isLoading: isLoadingActiveMembers,
    isFetching: isFetchingMembers,
    refetch: refetchMembers,
    dataUpdatedAt: membersUpdatedAt,
  } = usePagedCompanyMembers(
    membersPagination.pageIndex + 1,
    membersPagination.pageSize,
  );

  const {
    data: pagedPendingInvites,
    isLoading: isLoadingPendingInvites,
    isFetching: isFetchingInvites,
    refetch: refetchInvites,
    dataUpdatedAt: invitesUpdatedAt,
  } = usePagedPendingInvites(
    invitesPagination.pageIndex + 1,
    invitesPagination.pageSize,
  );

  const {
    data: pagedTeams,
    isLoading: isLoadingTeams,
    isFetching: isFetchingTeams,
    refetch: refetchTeams,
    dataUpdatedAt: teamsUpdatedAt,
  } = usePagedTeams(teamsPagination.pageIndex + 1, teamsPagination.pageSize);

  const handleRefresh = () => {
    refetchMembers();
    refetchInvites();
    refetchTeams();
  };

  const lastUpdated =
    membersUpdatedAt || invitesUpdatedAt || teamsUpdatedAt
      ? new Date(
          Math.max(
            membersUpdatedAt || 0,
            invitesUpdatedAt || 0,
            teamsUpdatedAt || 0,
          ),
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
              {pagedActiveMembers?.totalCount || 0}
            </Badge>
          </TabsTrigger>

          <TabsTrigger value="pending">
            {t("team.tabs.pending", "Pending Invites")}
            {(pagedPendingInvites?.totalCount ?? 0) > 0 && (
              <Badge
                variant="secondary"
                className="ml-2 bg-primary/10 text-primary"
              >
                {pagedPendingInvites?.totalCount}
              </Badge>
            )}
          </TabsTrigger>

          <TabsTrigger value="teams">
            {t("team.tabs.teams", "Teams")}
            {(pagedTeams?.totalCount ?? 0) > 0 && (
              <Badge
                variant="secondary"
                className="ml-2 bg-primary/10 text-primary"
              >
                {pagedTeams?.totalCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {isLoadingActiveMembers ? (
            <div className="h-32 flex items-center justify-center border rounded-xl bg-card">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : pagedActiveMembers?.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border bg-card p-12 text-center shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                <UserCog className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">
                {t("team.noActiveMembers", "No active members found")}
              </h3>
            </div>
          ) : (
            <DataTable
              columns={activeMembersColumns}
              data={pagedActiveMembers?.items ?? []}
              pageCount={pagedActiveMembers?.totalPages ?? 0}
              pagination={membersPagination}
              onPaginationChange={setMembersPagination}
              totalCount={pagedActiveMembers?.totalCount ?? 0}
            />
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {isLoadingPendingInvites ? (
            <div className="h-32 flex items-center justify-center border rounded-xl bg-card">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : pagedPendingInvites?.items?.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border bg-card p-12 text-center shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">
                {t("team.noPendingInvites", "No pending invitations")}
              </h3>
            </div>
          ) : (
            <DataTable
              columns={pendingInvitesColumns}
              data={pagedPendingInvites?.items ?? []}
              pageCount={pagedPendingInvites?.totalPages ?? 0}
              pagination={invitesPagination}
              onPaginationChange={setInvitesPagination}
              totalCount={pagedPendingInvites?.totalCount ?? 0}
            />
          )}
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

          {isLoadingTeams ? (
            <div className="h-32 flex items-center justify-center border rounded-xl bg-card">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : pagedTeams?.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border bg-card p-12 text-center shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">
                {t("team.noTeamsTitle", "No teams created yet")}
              </h3>
              <p className="text-sm text-muted-foreground mt-2 mb-6 max-w-sm">
                {t(
                  "team.noTeamsDesc",
                  "Organize your members into teams like 'Frontend', 'Marketing', or 'Design'.",
                )}
              </p>
              <CreateTeamModal
                customTrigger={
                  <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    {t("team.createTeam", "Create Team")}
                  </Button>
                }
              />
            </div>
          ) : (
            <DataTable
              columns={teamColumns}
              data={pagedTeams?.items ?? []}
              pageCount={pagedTeams?.totalPages ?? 0}
              pagination={teamsPagination}
              onPaginationChange={setTeamsPagination}
              totalCount={pagedTeams?.totalCount ?? 0}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
