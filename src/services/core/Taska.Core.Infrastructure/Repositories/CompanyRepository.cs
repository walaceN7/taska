using Microsoft.EntityFrameworkCore;
using Taska.Core.Application.Interfaces;
using Taska.Core.Domain.Entities;
using Taska.Core.Infrastructure.Persistence;

namespace Taska.Core.Infrastructure.Repositories;

public class CompanyRepository(TaskaCoreDbContext context) : ICompanyRepository
{

    public async Task<Company> AddAsync(Company company, CancellationToken cancellationToken)
    {
        await context.Companies.AddAsync(company, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
        return company;
    }

    public async Task<Company?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await context.Companies
            .FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
    }

    public async Task<Company> UpdateAsync(Company company, CancellationToken cancellationToken)
    {
        context.Companies.Update(company);
        await context.SaveChangesAsync(cancellationToken);
        return company;
    }

    public async Task<bool> ExistsByDomainAsync(string domain, CancellationToken cancellationToken)
    {
        return await context.Companies
            .AnyAsync(c => c.Domain == domain, cancellationToken);
    }
}