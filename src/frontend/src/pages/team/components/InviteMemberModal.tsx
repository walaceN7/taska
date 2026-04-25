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
import { useSendInvitationMutation } from "@/hooks/useInvitation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

export function InviteMemberModal() {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);

  const inviteSchema = z.object({
    email: z.email({
      message: t("auth.invalidEmail", "Invalid email address"),
    }),
  });

  type InviteFormValues = z.infer<typeof inviteSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: "",
    },
  });

  const inviteMutation = useSendInvitationMutation();

  const onSubmit = (values: InviteFormValues) => {
    inviteMutation.mutate(
      { email: values.email },
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
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {t("team.inviteMember", "Invite Member")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {t("team.inviteModalTitle", "Invite to Workspace")}
          </DialogTitle>
          <DialogDescription>
            {t(
              "team.inviteModalDesc",
              "Enter the email address of the person you want to invite to your team.",
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="email">
              {t("auth.emailLabel", "Email address")}
            </Label>
            <Input
              id="email"
              placeholder="colleague@company.com"
              {...register("email")}
              disabled={inviteMutation.isPending}
            />
            {errors.email && (
              <p className="text-sm font-medium text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={inviteMutation.isPending}
            >
              {t("common.cancel", "Cancel")}
            </Button>
            <Button type="submit" disabled={inviteMutation.isPending}>
              {inviteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("common.sending", "Sending...")}
                </>
              ) : (
                t("team.sendInvite", "Send Invite")
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
