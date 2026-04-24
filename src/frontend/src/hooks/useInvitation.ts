import { invitationService } from "@/services/invitationService";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface ApiErrorResponse {
  error: string;
  statusCode: number;
}

export function useSendInvitationMutation() {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: invitationService.sendInvitation,
    onSuccess: () => {
      toast.success(
        t("invitation.sendSuccess", "Invitation sent successfully!"),
      );
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const message =
        error.response?.data?.error ||
        t("invitation.sendError", "Failed to send invitation.");
      toast.error(message);
    },
  });
}
