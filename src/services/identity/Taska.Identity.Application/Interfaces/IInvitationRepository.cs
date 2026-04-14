using Taska.Identity.Domain.Entities;

namespace Taska.Identity.Application.Interfaces;

public interface IInvitationRepository
{
    ValueTask<Invitation> AddAsync(Invitation invitation, CancellationToken cancellationToken = default);
    ValueTask<bool> HasPendingInvitationAsync(string email, Guid companyId, CancellationToken cancellationToken = default);
}