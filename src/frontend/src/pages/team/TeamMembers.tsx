import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MoreHorizontal, Plus, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { InviteMemberModal } from "./components/InviteMemberModal";

export function TeamMembers() {
  const { t } = useTranslation();

  const members = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "CompanyAdmin",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Member",
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("team.title", "Team & Members")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("team.subtitle", "Manage your workspace members and teams.")}
          </p>
        </div>

        <InviteMemberModal />
      </header>

      <Tabs defaultValue="members" className="space-y-6">
        <TabsList>
          <TabsTrigger value="members">
            {t("team.tabs.members", "All Members")}
          </TabsTrigger>
          <TabsTrigger value="teams">
            {t("team.tabs.teams", "Teams")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead>{t("team.user", "User")}</TableHead>
                  <TableHead>{t("team.role", "System Role")}</TableHead>
                  <TableHead className="text-right">
                    {t("team.actions", "Actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="flex items-center gap-3 py-4">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {member.name.charAt(0)}
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
                      <Badge
                        variant={
                          member.role === "CompanyAdmin"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {member.role}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
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
