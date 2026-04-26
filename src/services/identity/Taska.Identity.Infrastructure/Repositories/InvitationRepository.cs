using Microsoft.EntityFrameworkCore;
using Taska.Identity.Application.Interfaces;
using Taska.Identity.Domain.Entities;
using Taska.Identity.Infrastructure.Persistence;
using Taska.Shared.Pagination;

namespace Taska.Identity.Infrastructure.Repositories;

public class InvitationRepository(TaskaIdentityDbContext context) : IInvitationRepository
{
    public async ValueTask<Invitation> AddAsync(Invitation invitation, CancellationToken cancellationToken = default)
    {
        await context.Invitations.AddAsync(invitation, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
        return invitation;
    }    

    public async ValueTask<bool> HasPendingInvitationAsync(string email, Guid companyId, CancellationToken cancellationToken = default)
    {
        return await context.Invitations.AnyAsync(i => i.Email == email && i.CompanyId == companyId && i.AcceptedAt == null, cancellationToken);
    }

    public async ValueTask<Invitation?> GetByTokenAsync(string token, CancellationToken cancellationToken = default)
    {
        return await context.Invitations.FirstOrDefaultAsync(i => i.Token == token, cancellationToken);
    }

    public async ValueTask<Invitation> UpdateAsync(Invitation invitation, CancellationToken cancellationToken = default)
    {
        await context.SaveChangesAsync(cancellationToken);
        return invitation;
    }

    public async ValueTask<IEnumerable<Invitation>> GetPendingByCompanyIdAsync(Guid companyId, CancellationToken cancellationToken = default)
    {
        return await context.Invitations.Where(i => i.CompanyId == companyId && i.AcceptedAt == null).AsNoTracking().ToListAsync(cancellationToken);
    }

    public async ValueTask<PagedResult<Invitation>> GetPendingByCompanyIdAsync(Guid companyId, PaginationParams paginationParams, CancellationToken cancellationToken)
    {
        return await context.Invitations
            .Where(t => t.CompanyId == companyId && t.AcceptedAt == null)            
            .OrderBy(t => t.CreatedAt)
            .AsNoTracking()
            .ToPagedResultAsync(paginationParams.PageNumber, paginationParams.PageSize, cancellationToken);
    }
}
