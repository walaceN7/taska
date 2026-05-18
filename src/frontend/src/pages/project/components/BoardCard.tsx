import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteBoardMutation } from "@/hooks/useBoard";
import { type BoardDto, BoardType } from "@/types/board.types";
import {
  Edit,
  KanbanSquare,
  LayoutDashboard,
  MoreHorizontal,
  Trash,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { BoardModal } from "./BoardModal";

interface BoardCardProps {
  board: BoardDto;
}

export function BoardCard({ board }: BoardCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const deleteMutation = useDeleteBoardMutation();

  const isKanban = board.type === BoardType.Kanban;

  const handleDelete = async () => {
    await deleteMutation.mutateAsync({ id: board.id });
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <Card
        className="hover:shadow-md transition-all cursor-pointer border-primary/10 hover:border-primary/30 flex flex-col group relative"
        onClick={() => navigate(`/projects/${projectId}/boards/${board.id}`)}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-bold pr-8 truncate">
            {board.name}
          </CardTitle>

          <div
            className="absolute top-4 right-4"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <BoardModal
                  board={board}
                  customTrigger={
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      {t("common.edit", "Edit")}
                    </DropdownMenuItem>
                  }
                />
                <DropdownMenuItem
                  className="cursor-pointer text-destructive focus:text-destructive"
                  onSelect={(e) => {
                    e.preventDefault();
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  {t("common.delete", "Delete")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between pt-2 mt-4">
            <Badge
              variant={isKanban ? "default" : "secondary"}
              className="w-fit"
            >
              {isKanban
                ? t("boards.type.kanban", "Kanban")
                : t("boards.type.scrum", "Scrum")}
            </Badge>

            {isKanban ? (
              <KanbanSquare className="h-5 w-5 text-muted-foreground opacity-50" />
            ) : (
              <LayoutDashboard className="h-5 w-5 text-muted-foreground opacity-50" />
            )}
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title={t("boards.confirmDeleteTitle", {
          name: board.name,
          defaultValue: `Delete board ${board.name}?`,
        })}
        description={t(
          "boards.confirmDeleteDescription",
          "Are you sure you want to delete this board? All columns and tasks inside it will be lost.",
        )}
        confirmText={t("common.delete", "Delete")}
        cancelText={t("common.cancel", "Cancel")}
        isDestructive={true}
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
