import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TeamDto } from "@/types/team.types";
import { type ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";
import { MoreHorizontal, Trash2, UserCog, Users } from "lucide-react";

export const getTeamColumns = (t: TFunction): ColumnDef<TeamDto>[] => [
  {
    accessorKey: "name",
    header: t("team.name", "Team Name"),
    cell: ({ row }) => {
      const team = row.original;
      return (
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
      );
    },
  },
  {
    accessorKey: "memberCount",
    header: t("team.memberCount", "Member Count"),
    cell: ({ row }) => {
      const count = row.original.memberCount;
      return (
        <Badge variant="secondary" className="bg-primary/10 text-primary">
          {count} {t("team.membersCount", "members")}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: () => (
      <div className="text-right">{t("team.actions", "Actions")}</div>
    ),
    cell: () => {
      return (
        <div className="text-right">
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
        </div>
      );
    },
  },
];
