import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { MemberDto } from "@/types/user.types";
import { type ColumnDef } from "@tanstack/react-table";
import { type TFunction } from "i18next";
import { ShieldAlert, UserCog } from "lucide-react";
import { ActiveMemberActionCell } from "../components/ActiveMemberActionCell";

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
            {isAdmin
              ? t("common.admin", "Admin")
              : t("common.member", "Member")}
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

    cell: ({ row }) => (
      <ActiveMemberActionCell
        member={row.original}
        currentUserId={currentUserId}
      />
    ),
  },
];
