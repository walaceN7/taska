import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type BoardDto, BoardType } from "@/types/board.types";
import { KanbanSquare, LayoutDashboard } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

interface BoardCardProps {
  board: BoardDto;
}

export function BoardCard({ board }: BoardCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();

  const isKanban = board.type === BoardType.Kanban;

  return (
    <Card
      className="hover:shadow-md transition-all cursor-pointer border-primary/10 hover:border-primary/30"
      onClick={() => navigate(`/projects/${projectId}/boards/${board.id}`)}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold">{board.name}</CardTitle>
        {isKanban ? (
          <KanbanSquare className="h-5 w-5 text-muted-foreground" />
        ) : (
          <LayoutDashboard className="h-5 w-5 text-muted-foreground" />
        )}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3 pt-2">
          <Badge variant={isKanban ? "default" : "secondary"} className="w-fit">
            {isKanban
              ? t("boards.type.kanban", "Kanban")
              : t("boards.type.scrum", "Scrum")}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
