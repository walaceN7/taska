using Taska.Identity.Domain.Entities;

namespace Taska.Identity.Application.Interfaces;

public interface IRefreshTokenRepository
{
    Task AddAsync(RefreshToken refreshToken, CancellationToken cancellationToken);
    Task<RefreshToken?> GetByTokenAsync(string token, CancellationToken cancellationToken);
    Task RevokeAsync(RefreshToken refreshToken, CancellationToken cancellationToken);
}