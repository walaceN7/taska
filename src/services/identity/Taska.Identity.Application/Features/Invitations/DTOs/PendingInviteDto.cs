namespace Taska.Identity.Application.Features.Invitations.DTOs;

public record PendingInviteDto(Guid Id, String Email, DateTime SentAt, DateTime ExpiresAt);
