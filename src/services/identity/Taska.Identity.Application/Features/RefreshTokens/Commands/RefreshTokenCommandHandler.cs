using Mediator;
using Taska.Identity.Application.Features.Users.DTOs;
using Taska.Identity.Application.Interfaces;
using Taska.Identity.Domain.Entities;
using Taska.Shared.Exceptions;

namespace Taska.Identity.Application.Features.RefreshTokens.Commands;

public class RefreshTokenCommandHandler(IRefreshTokenRepository refreshTokenRepository, IJwtService jwtService) : IRequestHandler<RefreshTokenCommand, LoginResult>
{
    public async ValueTask<LoginResult> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        var refreshToken = await refreshTokenRepository.GetByTokenAsync(request.RefreshToken, cancellationToken);

        if (refreshToken == null || refreshToken.IsRevoked || refreshToken.ExpiresAt < DateTime.UtcNow)
            throw new UnauthorizedException("Invalid or expired refresh token");

        await refreshTokenRepository.RevokeAsync(refreshToken, cancellationToken);

        var newAccessToken = jwtService.GenerateAccessToken(refreshToken.User);
        var newRefreshToken = jwtService.GenerateRefreshToken();

        var newRefreshTokenExpiry = DateTime.UtcNow.Add(refreshToken.ExpiresAt - refreshToken.CreatedAt);

        await refreshTokenRepository.AddAsync(new RefreshToken
        {
            Id = Guid.NewGuid(),
            Token = newRefreshToken,
            UserId = refreshToken.UserId,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = newRefreshTokenExpiry,
            IsRevoked = false
        }, cancellationToken);

        return new LoginResult(
            newAccessToken,
            newRefreshToken,
            DateTime.UtcNow.AddMinutes(15),
            newRefreshTokenExpiry,
            new UserDto(
                refreshToken.User.Id,
                $"{refreshToken.User.FirstName} {refreshToken.User.LastName}",
                refreshToken.User.Email!,
                refreshToken.User.AvatarUrl,
                refreshToken.User.SystemRole.ToString(),
                refreshToken.User.CompanyId
            )
        );
    }
}