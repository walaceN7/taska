namespace Taska.Identity.Application.Features.Invitations.DTOs;

public record InvitationResult(
    Guid Id,
    string Email,
    Guid CompanyId,
    DateTime ExpiresAt,
    bool IsAccepted
);