using Taska.Core.Domain.Entities;
using Taska.Shared.Pagination;

namespace Taska.Core.Application.Interfaces;

public interface ITeamRepository
{
    Task<Team> AddAsync(Team team, CancellationToken cancellationToken);
    Task<IEnumerable<Team>> GetByCompanyAsync(Guid companyId, CancellationToken cancellationToken);
    Task<PagedResult<Team>> GetByCompanyAsync(Guid companyId, PaginationParams paginationParams, CancellationToken cancellationToken);
}
