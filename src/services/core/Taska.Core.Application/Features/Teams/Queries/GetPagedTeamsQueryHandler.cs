using Mediator;
using Taska.Core.Application.Features.Teams.DTOs;
using Taska.Core.Application.Interfaces;
using Taska.Shared.Exceptions;
using Taska.Shared.Pagination;

namespace Taska.Core.Application.Features.Teams.Queries;

public class GetPagedTeamsQueryHandler(ITeamRepository repository, ICurrentUser currentUser) : IRequestHandler<GetPagedTeamsQuery, PagedResult<TeamResult>>
{
    public async ValueTask<PagedResult<TeamResult>> Handle(GetPagedTeamsQuery request, CancellationToken cancellationToken)
    {
        if (currentUser.CompanyId == null)
            throw new UnauthorizedException("Current user does not belong to a company.");
                
        var pagedTeams = await repository.GetByCompanyAsync(
            currentUser.CompanyId.Value,
            request.PaginationParams,
            cancellationToken);
        
        var teamResults = pagedTeams.Items.Select(t => new TeamResult(
            t.Id,
            t.Name,
            t.Description,
            t.CompanyId,
            t.TeamMembers.Count
        )).ToList();
                
        return new PagedResult<TeamResult>(
            teamResults,
            pagedTeams.TotalCount,
            pagedTeams.PageNumber,
            pagedTeams.PageSize);
    }
}
