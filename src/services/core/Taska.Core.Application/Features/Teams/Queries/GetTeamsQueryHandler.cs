using Mediator;
using Taska.Core.Application.Features.Teams.DTOs;
using Taska.Core.Application.Interfaces;
using Taska.Shared.Exceptions;

namespace Taska.Core.Application.Features.Teams.Queries;

public class GetTeamsQueryHandler(ITeamRepository repository, ICurrentUser currentUser) : IRequestHandler<GetTeamsQuery, IEnumerable<TeamResult>>
{
    public async ValueTask<IEnumerable<TeamResult>> Handle(GetTeamsQuery request, CancellationToken cancellationToken)
    {
        if (currentUser.CompanyId == null)
            throw new UnauthorizedException("Current user does not belong to a company.");

        var teams = await repository.GetByCompanyAsync(currentUser.CompanyId.Value, cancellationToken);

        return teams.Select(t => new TeamResult(
            t.Id,
            t.Name,
            t.Description,
            t.CompanyId,
            t.TeamMembers.Count
        ));
    }
}
