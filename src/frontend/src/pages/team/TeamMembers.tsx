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
  Clock,
  Mail,
  MoreHorizontal,
  Plus,
  Shield,
  ShieldAlert,
  Trash2,
  UserCog,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { InviteMemberModal } from "./components/InviteMemberModal";

export function TeamMembers() {
  const { t } = useTranslation();

  const activeMembers = [
    {
      id: "1",
      name: "Walace Silva",
      email: "walace@taska.com",
      role: "CompanyAdmin",
      avatarUrl: "https://github.com/walaceN7.png",
    },
    {
      id: "2",
      name: "John Doe",
      email: "john@example.com",
      role: "Member",
      avatarUrl: "",
    },
  ];

  const pendingInvites = [
    {
      id: "inv-1",
      email: "developer@example.com",
      sentAt: "2 days ago",
      expiresAt: "5 days left",
    },
  ];

  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

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

        <InviteMemberModal />
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
              <Badge variant="secondary" className="ml-2">
                {pendingInvites.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="teams">
            {t("team.tabs.teams", "Teams")}
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
                {activeMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="flex items-center gap-3 py-4">
                      <Avatar className="h-9 w-9 border">
                        <AvatarImage src={member.avatarUrl} alt={member.name} />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium leading-none">
                          {member.name}
                        </span>
                        <span className="text-sm text-muted-foreground mt-1">
                          {member.email}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        {member.role === "CompanyAdmin" ? (
                          <ShieldAlert className="h-4 w-4 text-primary" />
                        ) : (
                          <UserCog className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span
                          className={
                            member.role === "CompanyAdmin"
                              ? "font-medium"
                              : "text-muted-foreground"
                          }
                        >
                          {member.role === "CompanyAdmin" ? "Admin" : "Member"}
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
                ))}
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
                {pendingInvites.map((invite) => (
                  <TableRow key={invite.id}>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2 font-medium">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {invite.email}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Sent {invite.sentAt}
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
                        {invite.expiresAt}
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
                          {t("team.cancelInvite", "Cancel")}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="teams">
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card/50 p-12 text-center shadow-sm">
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
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              {t("team.createTeam", "Create Team")}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
