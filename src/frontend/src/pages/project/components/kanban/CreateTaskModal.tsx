import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateTaskItemMutation } from "@/hooks/useColumn";
import {
  type CreateTaskItemRequest,
  TaskPriority,
  TaskType,
} from "@/types/taskItem.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import z from "zod";

interface CreateTaskModalProps {
  columnId: string;
}

export function CreateTaskModal({ columnId }: CreateTaskModalProps) {
  const { t } = useTranslation();
  const { boardId } = useParams<{ boardId: string }>();
  const [isOpen, setIsOpen] = useState(false);

  const createMutation = useCreateTaskItemMutation(boardId!);

  const taskSchema = z.object({
    title: z
      .string()
      .min(3, t("task.titleMin", "Title must be at least 3 characters")),
    description: z.string().optional(),
    priority: z.number(),
    type: z.number(),
  });

  type TaskFormValues = z.infer<typeof taskSchema>;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: TaskPriority.Medium,
      type: TaskType.Feature,
    },
  });

  const onSubmit = (values: TaskFormValues) => {
    const payload: CreateTaskItemRequest = {
      title: values.title,
      description: values.description || "",
      priority: values.priority,
      type: values.type,
    };

    createMutation.mutate(
      { columnId, request: payload },
      {
        onSuccess: () => {
          setIsOpen(false);
          reset();
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full mt-2 justify-start text-muted-foreground border-2 border-dashed bg-muted/30 hover:bg-muted/50"
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("task.add", "Add a task")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("task.add", "Add a task")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>{t("task.title", "Title")}</Label>
            <Input
              {...register("title")}
              placeholder={t("task.titlePlaceholder", "Task title")}
              disabled={createMutation.isPending}
            />
            {errors.title && (
              <p className="text-destructive text-xs">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>{t("task.description", "Description")}</Label>
            <Textarea
              {...register("description")}
              placeholder={t("task.descPlaceholder", "Add details...")}
              disabled={createMutation.isPending}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("task.priorityLabel", "Priority")}</Label>
              <Controller
                control={control}
                name="priority"
                render={({ field }) => (
                  <Select
                    onValueChange={(val) => field.onChange(Number(val))}
                    defaultValue={String(field.value)}
                    disabled={createMutation.isPending}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={String(TaskPriority.Low)}>
                        {t("task.priority.low", "Low")}
                      </SelectItem>
                      <SelectItem value={String(TaskPriority.Medium)}>
                        {t("task.priority.medium", "Medium")}
                      </SelectItem>
                      <SelectItem value={String(TaskPriority.High)}>
                        {t("task.priority.high", "High")}
                      </SelectItem>
                      <SelectItem value={String(TaskPriority.Critical)}>
                        {t("task.priority.critical", "Critical")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>{t("task.typeLabel", "Type")}</Label>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Select
                    onValueChange={(val) => field.onChange(Number(val))}
                    defaultValue={String(field.value)}
                    disabled={createMutation.isPending}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={String(TaskType.Feature)}>
                        {t("task.type.feature", "Feature")}
                      </SelectItem>
                      <SelectItem value={String(TaskType.Bug)}>
                        {t("task.type.bug", "Bug")}
                      </SelectItem>
                      <SelectItem value={String(TaskType.Improvement)}>
                        {t("task.type.improvement", "Improvement")}
                      </SelectItem>
                      <SelectItem value={String(TaskType.Technical)}>
                        {t("task.type.technical", "Technical")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={createMutation.isPending}
            >
              {t("common.cancel", "Cancel")}
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
