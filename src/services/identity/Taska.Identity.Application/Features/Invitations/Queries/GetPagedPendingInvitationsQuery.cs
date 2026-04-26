using Mediator;
using Taska.Identity.Application.Features.Invitations.DTOs;
using Taska.Shared.Pagination;

namespace Taska.Identity.Application.Features.Invitations.Queries;

public record GetPagedPendingInvitationsQuery(PaginationParams PaginationParams) : IRequest<PagedResult<PendingInviteDto>>;
