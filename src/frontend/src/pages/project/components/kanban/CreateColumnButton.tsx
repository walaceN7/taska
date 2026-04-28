import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateColumnMutation } from "@/hooks/useBoard";
import { Loader2, Plus, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

export function CreateColumnButton() {
  const { t } = useTranslation();
  const { boardId } = useParams<{ boardId: string }>();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");

  const createMutation = useCreateColumnMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !boardId) return;

    createMutation.mutate(
      { id: boardId, request: { name: name.trim() } },
      {
        onSuccess: () => {
          setName("");
          setIsEditing(false);
        },
      },
    );
  };

  const handleCancel = () => {
    setIsEditing(false);
    setName("");
  };

  if (isEditing) {
    return (
      <div className="bg-muted/50 rounded-xl w-80 min-w-80 p-3 border h-fit shadow-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <Input
            autoFocus
            placeholder={t("columns.namePlaceholder", "Enter list title...")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={createMutation.isPending}
            className="bg-background"
          />
          <div className="flex items-center gap-2">
            <Button
              type="submit"
              size="sm"
              disabled={createMutation.isPending || !name.trim()}
            >
              {createMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                t("common.add", "Add")
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              disabled={createMutation.isPending}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      className="w-80 min-w-80 h-12 border-2 border-dashed bg-muted/30 hover:bg-muted/50 justify-start text-muted-foreground"
      onClick={() => setIsEditing(true)}
    >
      <Plus className="mr-2 h-4 w-4" />
      {t("columns.addAnother", "Add another list")}
    </Button>
  );
}
