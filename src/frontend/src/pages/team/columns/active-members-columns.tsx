import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { MemberDto } from "@/types/team.types";
import { type ColumnDef } from "@tanstack/react-table";
import { type TFunction } from "i18next";
import {
  MoreHorizontal,
  Shield,
  ShieldAlert,
  Trash2,
  UserCog,
} from "lucide-react";

const getInitials = (name: string) => {
  if (!name) return "US";
  return name.substring(0, 2).toUpperCase();
};
export const getActiveMembersColumns = (
  t: TFunction,
  currentUserId?: string,
): ColumnDef<MemberDto>[] => [
  {
    accessorKey: "fullName",
    header: t("team.user", "User"),
    cell: ({ row }) => {
      const member = row.original;
      return (
        <div className="flex items-center gap-3 py-2">
          <Avatar className="h-9 w-9 border">
            <AvatarImage src={member.avatarUrl} alt={member.fullName} />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {getInitials(member.fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium leading-none">{member.fullName}</span>
            <span className="text-sm text-muted-foreground mt-1">
              {member.email}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "systemRole",
    header: t("team.role", "Role"),
    cell: ({ row }) => {
      const role = row.original.systemRole;
      const isAdmin = role === "CompanyAdmin" || role === "SaasAdmin";

      return (
        <div className="flex items-center gap-2">
          {isAdmin ? (
            <ShieldAlert className="h-4 w-4 text-primary" />
          ) : (
            <UserCog className="h-4 w-4 text-muted-foreground" />
          )}
          <span className={isAdmin ? "font-medium" : "text-muted-foreground"}>
            {isAdmin ? "Admin" : "Member"}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => (
      <div className="text-right">{t("team.actions", "Actions")}</div>
    ),
    cell: ({ row }) => {
      const member = row.original;
      const isSelf = member.id === currentUserId;

      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground"
                disabled={isSelf}
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
        </div>
      );
    },
  },
];
