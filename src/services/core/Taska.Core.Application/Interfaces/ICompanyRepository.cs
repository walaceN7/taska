using Taska.Core.Domain.Entities;

namespace Taska.Core.Application.Interfaces;

public interface ICompanyRepository
{
    Task<Company> AddAsync(Company company, CancellationToken cancellationToken);
    Task<Company?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<Company> UpdateAsync(Company company, CancellationToken cancellationToken);
    Task<bool> ExistsByDomainAsync(string domain, CancellationToken cancellationToken);
}