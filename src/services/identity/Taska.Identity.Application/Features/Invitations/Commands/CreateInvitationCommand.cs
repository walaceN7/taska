using Mediator;
using Taska.Identity.Application.Features.Invitations.DTOs;

namespace Taska.Identity.Application.Features.Invitations.Commands;

public record CreateInvitationCommand(string Email) : IRequest<InvitationResult>;
