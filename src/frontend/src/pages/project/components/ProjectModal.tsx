import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  useCreateProjectMutation,
  useUpdateProjectMutation,
} from "@/hooks/useProject";
import { cn, formatDate } from "@/lib/utils";
import type {
  CreateProjectRequest,
  ProjectDto,
  UpdateProjectRequest,
} from "@/types/project.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import z from "zod";

interface ProjectModalProps {
  project?: ProjectDto;
  customTrigger?: React.ReactNode;
}

export function ProjectModal({ project, customTrigger }: ProjectModalProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isEndOpen, setIsEndOpen] = useState(false);

  const isEditing = !!project;

  const createSchema = z.object({
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
    startDate: z.date().optional(),
    endDate: z.date().optional(),
  });

  type ProjectFormValues = z.infer<typeof createSchema>;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      name: project?.name || "",
      description: project?.description || "",
      startDate: project?.startDate ? new Date(project.startDate) : undefined,
      endDate: project?.endDate ? new Date(project.endDate) : undefined,
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        name: project?.name || "",
        description: project?.description || "",
        startDate: project?.startDate ? new Date(project.startDate) : undefined,
        endDate: project?.endDate ? new Date(project.endDate) : undefined,
      });
    }
  }, [isOpen, project, reset]);

  const createMutation = useCreateProjectMutation();
  const updateMutation = useUpdateProjectMutation();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (values: ProjectFormValues) => {
    if (isEditing) {
      const payload: UpdateProjectRequest = {
        projectId: project.id,
        name: values.name,
      };

      if (values.description && values.description.trim() !== "") {
        payload.description = values.description;
      }

      if (values.startDate) {
        payload.startDate = values.startDate.toISOString();
      }

      if (values.endDate) {
        payload.endDate = values.endDate.toISOString();
      }

      updateMutation.mutate(payload, {
        onSuccess: () => {
          setIsOpen(false);
          reset();
        },
      });
    } else {
      const payload: CreateProjectRequest = { name: values.name };

      if (values.description && values.description.trim() !== "") {
        payload.description = values.description;
      }

      if (values.startDate) {
        payload.startDate = values.startDate.toISOString();
      }

      if (values.endDate) {
        payload.endDate = values.endDate.toISOString();
      }

      createMutation.mutate(payload, {
        onSuccess: () => {
          setIsOpen(false);
          reset();
        },
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {customTrigger ? (
          customTrigger
        ) : (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t("project.createProject", "Create Project")}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? t("project.editProject", "Edit Project")
              : t("project.createProject", "Create Project")}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? t("project.editProjectDescription", "Update project details")
              : t("project.createProjectDescription", "Create a new project")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t("project.name", "Name")}</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder={t("project.namePlaceholder", "Enter project name")}
              disabled={isPending}
            />
            {errors.name && (
              <p className="text-destructive text-sm font-medium">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              {t("project.description", "Description")}
            </Label>
            <Input
              id="description"
              {...register("description")}
              placeholder={t(
                "project.descriptionPlaceholder",
                "Enter project description",
              )}
              disabled={isPending}
            />
            {errors.description && (
              <p className="text-destructive text-sm font-medium">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 flex flex-col">
              <Label>{t("project.startDate", "Start Date")}</Label>
              <Controller
                control={control}
                name="startDate"
                render={({ field }) => (
                  <Popover open={isStartOpen} onOpenChange={setIsStartOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        disabled={isPending}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          formatDate(field.value.toISOString()).split(",")[0]
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
                        autoFocus
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
                        variant={"outline"}
                        disabled={isPending}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          formatDate(field.value.toISOString()).split(",")[0]
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
                        autoFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => setIsOpen(false)}
            >
              {t("common.cancel", "Cancel")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing
                    ? t("common.saving", "Saving...")
                    : t("common.creating", "Creating...")}
                </>
              ) : isEditing ? (
                t("common.save", "Save")
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
