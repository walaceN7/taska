import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
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
  useRemoveCompanyMember,
  useUpdateCompanyMemberRole,
} from "@/hooks/useUser";
import type { MemberDto, UserRole } from "@/types/user.types";
import { Loader2, MoreHorizontal, Shield, Trash2, UserCog } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface ActiveMemberActionCellProps {
  member: MemberDto;
  currentUserId?: string | undefined;
}

export function ActiveMemberActionCell({
  member,
  currentUserId,
}: ActiveMemberActionCellProps) {
  const { t } = useTranslation();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const updateRoleMutation = useUpdateCompanyMemberRole();
  const removeMemberMutation = useRemoveCompanyMember();

  const isSelf = member.id === currentUserId;

  const isAdmin =
    member.systemRole === "CompanyAdmin" || member.systemRole === "SaasAdmin";

  if (isSelf) return null;

  const handleUpdateRole = (newRole: UserRole) => {
    updateRoleMutation.mutate({ userId: member.id, role: newRole });
  };

  const handleRemove = async () => {
    await removeMemberMutation.mutateAsync(member.id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="text-right">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground"
            disabled={
              updateRoleMutation.isPending || removeMemberMutation.isPending
            }
          >
            {updateRoleMutation.isPending || removeMemberMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MoreHorizontal className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>
            {t("team.manageAccess", "Manage Access")}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {!isAdmin && (
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => handleUpdateRole("CompanyAdmin")}
            >
              <Shield className="mr-2 h-4 w-4" />
              {t("team.makeAdmin", "Make Admin")}
            </DropdownMenuItem>
          )}

          {isAdmin && (
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => handleUpdateRole("Member")}
            >
              <UserCog className="mr-2 h-4 w-4" />
              {t("team.makeMember", "Make Member")}
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:text-destructive"
            onSelect={(e) => {
              e.preventDefault();
              setIsDeleteDialogOpen(true);
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {t("team.removeMember", "Remove from Workspace")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleRemove}
        title={t("team.confirmRemoveTitle", {
          name: member.fullName,
          defaultValue: `Remove ${member.fullName}?`,
        })}
        description={t(
          "team.confirmRemoveDescription",
          "Are you sure you want to remove this member from the workspace? They will lose access immediately.",
        )}
        confirmText={t("common.remove", "Remove")}
        cancelText={t("common.cancel", "Cancel")}
        isDestructive={true}
        isLoading={removeMemberMutation.isPending}
      />
    </div>
  );
}
