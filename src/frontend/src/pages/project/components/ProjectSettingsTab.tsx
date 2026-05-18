import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  useDeleteProjectMutation,
  useUpdateProjectMutation,
} from "@/hooks/useProject";
import { cn, formatDate } from "@/lib/utils";
import {
  ProjectStatus,
  type ProjectDto,
  type UpdateProjectRequest,
} from "@/types/project.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader2, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import z from "zod";

interface ProjectSettingsTabProps {
  project: ProjectDto;
}

export function ProjectSettingsTab({ project }: ProjectSettingsTabProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isEndOpen, setIsEndOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const updateMutation = useUpdateProjectMutation();
  const deleteMutation = useDeleteProjectMutation();

  const settingsSchema = z.object({
    name: z
      .string()
      .min(
        3,
        t("project.nameMin", "Project name must be at least 3 characters"),
      )
      .max(
        100,
        t("project.nameMax", "Project name must be at most 100 characters"),
      ),
    description: z.string().optional(),
    status: z.number(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
  });

  type SettingsFormValues = z.infer<typeof settingsSchema>;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: project.name,
      description: project.description || "",
      status: project.status,
      startDate: project.startDate ? new Date(project.startDate) : undefined,
      endDate: project.endDate ? new Date(project.endDate) : undefined,
    },
  });

  useEffect(() => {
    reset({
      name: project.name,
      description: project.description || "",
      status: project.status,
      startDate: project.startDate ? new Date(project.startDate) : undefined,
      endDate: project.endDate ? new Date(project.endDate) : undefined,
    });
  }, [project, reset]);

  const onSubmit = (values: SettingsFormValues) => {
    const payload: UpdateProjectRequest = {
      projectId: project.id,
      name: values.name,
      description: values.description || "",
      status: values.status as ProjectStatus,
    };

    if (values.startDate) {
      payload.startDate = values.startDate.toISOString();
    }
    if (values.endDate) {
      payload.endDate = values.endDate.toISOString();
    }

    updateMutation.mutate(payload);
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(project.id);
    setIsDeleteDialogOpen(false);
    navigate("/projects");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card className="bg-background/50 backdrop-blur-sm border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold tracking-tight">
              {t("project.basicInfo", "Basic Information")}
            </CardTitle>
            <CardDescription>
              {t("project.editProjectDescription", "Update project details")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("project.name", "Name")}</Label>
                  <Input
                    id="name"
                    {...register("name")}
                    disabled={updateMutation.isPending}
                  />
                  {errors.name && (
                    <p className="text-destructive text-xs font-medium">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">
                    {t("project.statusLabel", "Status")}
                  </Label>
                  <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <Select
                        onValueChange={(val) => field.onChange(Number(val))}
                        value={String(field.value)}
                        disabled={updateMutation.isPending}
                      >
                        <SelectTrigger id="status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={String(ProjectStatus.Planning)}>
                            {t("project.status.planning", "Planning")}
                          </SelectItem>
                          <SelectItem value={String(ProjectStatus.Active)}>
                            {t("project.status.active", "Active")}
                          </SelectItem>
                          <SelectItem value={String(ProjectStatus.OnHold)}>
                            {t("project.status.onhold", "On Hold")}
                          </SelectItem>
                          <SelectItem value={String(ProjectStatus.Completed)}>
                            {t("project.status.completed", "Completed")}
                          </SelectItem>
                          <SelectItem value={String(ProjectStatus.Cancelled)}>
                            {t("project.status.cancelled", "Cancelled")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  {t("project.description", "Description")}
                </Label>
                <Textarea
                  id="description"
                  rows={4}
                  className="resize-none"
                  {...register("description")}
                  disabled={updateMutation.isPending}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 flex flex-col">
                  <Label>{t("project.startDate", "Start Date")}</Label>
                  <Controller
                    control={control}
                    name="startDate"
                    render={({ field }) => (
                      <Popover open={isStartOpen} onOpenChange={setIsStartOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            disabled={updateMutation.isPending}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              formatDate(field.value.toISOString()).split(
                                ",",
                              )[0]
                            ) : (
                              <span>{t("common.pickDate", "Pick a date")}</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              field.onChange(date);
                              setIsStartOpen(false);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                </div>

                <div className="space-y-2 flex flex-col">
                  <Label>{t("project.endDate", "End Date")}</Label>
                  <Controller
                    control={control}
                    name="endDate"
                    render={({ field }) => (
                      <Popover open={isEndOpen} onOpenChange={setIsEndOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            disabled={updateMutation.isPending}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              formatDate(field.value.toISOString()).split(
                                ",",
                              )[0]
                            ) : (
                              <span>{t("common.pickDate", "Pick a date")}</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              field.onChange(date);
                              setIsEndOpen(false);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("common.saving", "Saving...")}
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {t("common.save", "Save Changes")}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="border-destructive/30 bg-destructive/5 backdrop-blur-sm shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold tracking-tight text-destructive">
              {t("common.dangerZone", "Danger Zone")}
            </CardTitle>
            <CardDescription>
              {t(
                "project.confirmDeleteDescription",
                "Are you sure you want to delete this project? This action cannot be undone.",
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 p-4 bg-background/60 rounded-xl border border-destructive/20">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {t("common.delete", "Delete Project")}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t(
                    "project.deleteWarning",
                    "Once deleted, all boards, columns, and tasks related to this project will be permanently gone.",
                  )}
                </p>
              </div>
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => setIsDeleteDialogOpen(true)}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t("common.delete", "Delete")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title={t("project.confirmDeleteTitle", {
          name: project.name,
          defaultValue: `Delete project ${project.name}?`,
        })}
        description={t(
          "project.confirmDeleteDescription",
          "Are you sure you want to delete this project? This action cannot be undone.",
        )}
        confirmText={t("common.delete", "Delete")}
        cancelText={t("common.cancel", "Cancel")}
        isDestructive={true}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
