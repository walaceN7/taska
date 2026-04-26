using Taska.Identity.Domain.Entities;
using Taska.Shared.Pagination;

namespace Taska.Identity.Application.Interfaces;

public interface IInvitationRepository
{
    ValueTask<Invitation> AddAsync(Invitation invitation, CancellationToken cancellationToken = default);
    ValueTask<bool> HasPendingInvitationAsync(string email, Guid companyId, CancellationToken cancellationToken = default);
    ValueTask<Invitation?> GetByTokenAsync(string token, CancellationToken cancellationToken = default);
    ValueTask<Invitation> UpdateAsync(Invitation invitation, CancellationToken cancellationToken = default);
    ValueTask<IEnumerable<Invitation>> GetPendingByCompanyIdAsync(Guid companyId, CancellationToken cancellationToken = default);
    ValueTask<PagedResult<Invitation>> GetPendingByCompanyIdAsync(Guid companyId, PaginationParams paginationParams, CancellationToken cancellationToken);
}