using Microsoft.EntityFrameworkCore;
using Taska.Core.Application.Interfaces;
using Taska.Core.Domain.Entities;
using Taska.Core.Infrastructure.Persistence;
using Taska.Shared.Pagination;

namespace Taska.Core.Infrastructure.Repositories;

public class TeamRepository(TaskaCoreDbContext context) : ITeamRepository
{
    public async Task<Team> AddAsync(Team team, CancellationToken cancellationToken)
    {
        context.Teams.Add(team);
        await context.SaveChangesAsync(cancellationToken);
        return team;
    }

    public async Task<IEnumerable<Team>> GetByCompanyAsync(Guid companyId, CancellationToken cancellationToken)
    {
        return await context.Teams
            .Where(t => t.CompanyId == companyId)
            .Include(t => t.TeamMembers)
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }

    public async Task<PagedResult<Team>> GetByCompanyAsync(Guid companyId, PaginationParams paginationParams, CancellationToken cancellationToken)
    {
        return await context.Teams
            .Where(t => t.CompanyId == companyId)
            .Include(t => t.TeamMembers)
            .OrderBy(t => t.Name)
            .AsNoTracking()            
            .ToPagedResultAsync(paginationParams.PageNumber, paginationParams.PageSize, cancellationToken);
    }
}
