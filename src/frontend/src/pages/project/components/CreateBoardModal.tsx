import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCreateBoardMutation } from "@/hooks/useBoard";
import { BoardType, type CreateBoardRequest } from "@/types/board.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { KanbanSquare, LayoutDashboard, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import z from "zod";

export function CreateBoardModal() {
  const { t } = useTranslation();
  const { projectId } = useParams<{ projectId: string }>();
  const [isOpen, setIsOpen] = useState(false);

  const createSchema = z.object({
    name: z
      .string()
      .min(3, t("boards.nameMin", "Board name must be at least 3 characters")),
    type: z.number().int(),
  });

  type CreateBoardFormValues = z.infer<typeof createSchema>;

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<CreateBoardFormValues>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      name: "",
      type: BoardType.Kanban,
    },
  });

  const selectedType = useWatch({
    control,
    name: "type",
  });

  const createMutation = useCreateBoardMutation();

  const onSubmit = (values: CreateBoardFormValues) => {
    if (!projectId) return;

    const payload: CreateBoardRequest = {
      projectId: projectId,
      name: values.name,
      type: values.type,
    };

    createMutation.mutate(payload, {
      onSuccess: () => {
        setIsOpen(false);
        reset();
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {t("boards.create", "Create Board")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("boards.create", "Create Board")}</DialogTitle>
          <DialogDescription>
            {t("boards.createDescription", "Add a new board to this project.")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t("boards.name", "Board Name")}</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder={t(
                "boards.namePlaceholder",
                "Ex: Sprint 1, Backlog, Development",
              )}
              disabled={createMutation.isPending}
            />
            {errors.name && (
              <p className="text-destructive text-sm font-medium">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-3 pt-2">
            <Label>{t("boards.typeLabel", "Board Type")}</Label>
            <RadioGroup
              value={String(selectedType)}
              onValueChange={(val) => setValue("type", Number(val))}
              className="grid grid-cols-2 gap-4"
              disabled={createMutation.isPending}
            >
              <Label
                htmlFor="type-kanban"
                className={`relative flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all hover:bg-accent/50 ${
                  selectedType === BoardType.Kanban
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-input"
                }`}
              >
                <RadioGroupItem
                  value={String(BoardType.Kanban)}
                  id="type-kanban"
                  className="sr-only"
                />
                <KanbanSquare className="h-6 w-6 mb-2 text-primary" />
                <span className="font-semibold">
                  {t("boards.type.kanban", "Kanban")}
                </span>
              </Label>

              <Label
                htmlFor="type-scrum"
                className={`relative flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all hover:bg-accent/50 ${
                  selectedType === BoardType.Scrum
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-input"
                }`}
              >
                <RadioGroupItem
                  value={String(BoardType.Scrum)}
                  id="type-scrum"
                  className="sr-only"
                />
                <LayoutDashboard className="h-6 w-6 mb-2 text-muted-foreground" />
                <span className="font-semibold">
                  {t("boards.type.scrum", "Scrum")}
                </span>
              </Label>
            </RadioGroup>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              disabled={createMutation.isPending}
              onClick={() => setIsOpen(false)}
            >
              {t("common.cancel", "Cancel")}
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("common.creating", "Creating...")}
                </>
              ) : (
                t("common.create", "Create")
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
