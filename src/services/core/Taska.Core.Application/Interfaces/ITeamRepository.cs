using Taska.Core.Domain.Entities;

namespace Taska.Core.Application.Interfaces;

public interface ITeamRepository
{
    Task<Team> AddAsync(Team team, CancellationToken cancellationToken);
    Task<IEnumerable<Team>> GetByCompanyAsync(Guid companyId, CancellationToken cancellationToken);
}
