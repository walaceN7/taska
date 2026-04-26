import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import type { PendingInviteDto } from "@/types/team.types";
import { type ColumnDef } from "@tanstack/react-table";
import { type TFunction } from "i18next";
import { Clock, Mail } from "lucide-react";

export const getPendingInvitesColumns = (
  t: TFunction,
): ColumnDef<PendingInviteDto>[] => [
  {
    accessorKey: "email",
    header: t("team.email", "Email Address"),
    cell: ({ row }) => {
      const invite = row.original;
      return (
        <div className="py-2">
          <div className="flex items-center gap-2 font-medium">
            <Mail className="h-4 w-4 text-muted-foreground" />
            {invite.email}
          </div>
          <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {t("team.sent", "Sent")} {formatDate(invite.sentAt)}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "expiresAt",
    header: t("team.status", "Status"),
    cell: ({ row }) => {
      const invite = row.original;
      return (
        <div>
          <Badge
            variant="outline"
            className="text-amber-500 border-amber-500/30 bg-amber-500/10"
          >
            {t("team.statusPending", "Pending")}
          </Badge>
          <div className="text-xs text-muted-foreground mt-1">
            {t("team.expires", "Expires")} {formatDate(invite.expiresAt)}
          </div>
        </div>
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
      );
    },
  },
];
