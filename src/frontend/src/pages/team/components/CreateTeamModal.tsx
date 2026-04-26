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
import { Textarea } from "@/components/ui/textarea";
import { useCreateTeamMutation } from "@/hooks/useTeam";
import { cn } from "@/lib/utils";
import type { TeamRequest } from "@/types/team.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

interface CreateTeamModalProps {
  customTrigger?: React.ReactNode;
}

export function CreateTeamModal({ customTrigger }: CreateTeamModalProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const createSchema = z.object({
    name: z
      .string()
      .min(3, t("team.nameTooShort", "Name must be at least 3 characters")),
    description: z.string().optional(),
  });

  type CreateTeamFormValues = z.infer<typeof createSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTeamFormValues>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const createMutation = useCreateTeamMutation();

  const onSubmit = (values: CreateTeamFormValues) => {
    const payload: TeamRequest = { name: values.name };
    if (values.description && values.description.trim() !== "") {
      payload.description = values.description;
    }

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
        {customTrigger ? (
          customTrigger
        ) : (
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            {t("team.createTeam", "Create Team")}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("team.createTeam", "Create Team")}</DialogTitle>
          <DialogDescription>
            {t(
              "team.createTeamDescription",
              "Enter the details for your new team.",
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t("team.name", "Name")}</Label>
            <Input
              id="name"
              {...register("name")}
              disabled={createMutation.isPending}
              className={cn("w-full", errors.name && "border-destructive")}
            />
            {errors.name && (
              <p className="text-destructive text-xs font-medium">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              {t("common.description", "Description")}
            </Label>
            <Textarea
              id="description"
              {...register("description")}
              disabled={createMutation.isPending}
              className={cn(
                "w-full resize-none",
                errors.description && "border-destructive",
              )}
            />
            {errors.description && (
              <p className="text-destructive text-xs font-medium">
                {errors.description.message}
              </p>
            )}
          </div>

          <DialogFooter>
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
