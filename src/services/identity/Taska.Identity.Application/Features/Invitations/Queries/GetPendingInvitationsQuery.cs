using Mediator;
using Taska.Identity.Application.Features.Invitations.DTOs;

namespace Taska.Identity.Application.Features.Invitations.Queries;

public record GetPendingInvitationsQuery() : IRequest<IEnumerable<PendingInviteDto>>;
