using Mapster;
using Mediator;
using Taska.Identity.Application.Features.Invitations.DTOs;
using Taska.Identity.Application.Interfaces;
using Taska.Shared.Exceptions;

namespace Taska.Identity.Application.Features.Invitations.Queries;

public class GetPendingInvitationsQueryHandler(IInvitationRepository repository, ICurrentUser currentUser) : IRequestHandler<GetPendingInvitationsQuery, IEnumerable<PendingInviteDto>>
{
    public async ValueTask<IEnumerable<PendingInviteDto>> Handle(GetPendingInvitationsQuery request, CancellationToken cancellationToken)
    {
        if (!currentUser.CompanyId.HasValue)
            throw new ValidationException("Current user does not belong to any company.");

        var result = await repository.GetPendingByCompanyIdAsync(currentUser.CompanyId.Value, cancellationToken);

        return result.Adapt<IEnumerable<PendingInviteDto>>();
    }
}
