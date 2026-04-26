using Mediator;
using Taska.Identity.Application.Features.Invitations.DTOs;
using Taska.Identity.Application.Interfaces;
using Taska.Shared.Exceptions;
using Taska.Shared.Pagination;

namespace Taska.Identity.Application.Features.Invitations.Queries;

public class GetPagedPendingInvitationsQueryHandler(IInvitationRepository repository, ICurrentUser currentUser) : IRequestHandler<GetPagedPendingInvitationsQuery, PagedResult<PendingInviteDto>>
{
    public async ValueTask<PagedResult<PendingInviteDto>> Handle(GetPagedPendingInvitationsQuery request, CancellationToken cancellationToken)
    {
        if(currentUser.CompanyId == null)
            throw new UnauthorizedException("Current user does not belong to a company.");

        var pagedInvitations = await repository.GetPendingByCompanyIdAsync(
            currentUser.CompanyId.Value,
            request.PaginationParams,
            cancellationToken);

        var pendingInviteResults = pagedInvitations.Items.Select(t => new PendingInviteDto(
            t.Id,
            t.Email,
            t.CreatedAt,
            t.ExpiresAt
        )).ToList();

        return new PagedResult<PendingInviteDto>(
            pendingInviteResults,
            pagedInvitations.TotalCount,
            pagedInvitations.PageNumber,
            pagedInvitations.PageSize);
    }
}
