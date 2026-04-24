import { api } from "@/lib/api";
import type {
  InvitationDto,
  SendInvitationRequest,
} from "@/types/invitation.types";

const urlBase = "identity/api/invitations";

export const invitationService = {
  sendInvitation: async (
    payload: SendInvitationRequest,
  ): Promise<InvitationDto> => {
    const response = await api.post<InvitationDto>(`${urlBase}`, payload);
    return response.data;
  },
};
