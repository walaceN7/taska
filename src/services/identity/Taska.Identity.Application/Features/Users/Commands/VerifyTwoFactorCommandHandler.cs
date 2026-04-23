using Mediator;
using Microsoft.AspNetCore.Identity;
using Taska.Identity.Application.Features.Users.DTOs;
using Taska.Identity.Application.Interfaces;
using Taska.Identity.Domain.Entities;
using Taska.Shared.Exceptions;

namespace Taska.Identity.Application.Features.Users.Commands;

public class VerifyTwoFactorCommandHandler(UserManager<User> userManager, IJwtService jwtService, IRefreshTokenRepository refreshTokenRepository) : IRequestHandler<VerifyTwoFactorCommand, LoginResult>
{
    public async ValueTask<LoginResult> Handle(VerifyTwoFactorCommand request, CancellationToken cancellationToken)
    {
        var user = await userManager.FindByEmailAsync(request.Email)
            ?? throw new UnauthorizedException("Invalid request.");
                
        var isTempTokenValid = await userManager.VerifyUserTokenAsync(user, "Default", "2FA-Auth", request.TwoFactorToken);
        if (!isTempTokenValid)
            throw new UnauthorizedException("Session expired or invalid. Please login again.");
                
        var isTotpValid = await userManager.VerifyTwoFactorTokenAsync(
            user,
            userManager.Options.Tokens.AuthenticatorTokenProvider,
            request.Code);

        if (!isTotpValid)
            throw new ValidationException("Invalid authentication code.");
                
        user.LastLoginAt = DateTime.UtcNow;
        await userManager.UpdateAsync(user);

        var accessToken = jwtService.GenerateAccessToken(user);
        var refreshToken = jwtService.GenerateRefreshToken();
        var refreshTokenExpiryDate = DateTime.UtcNow.AddDays(30);

        await refreshTokenRepository.AddAsync(new RefreshToken
        {
            Id = Guid.NewGuid(),
            Token = refreshToken,
            UserId = user.Id,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = refreshTokenExpiryDate,
            IsRevoked = false
        }, cancellationToken);

        return new LoginResult(
            accessToken,
            refreshToken,
            DateTime.UtcNow.AddMinutes(15),
            refreshTokenExpiryDate,
            new UserDto(user.Id, $"{user.FirstName} {user.LastName}", user.Email!, user.AvatarUrl, user.SystemRole.ToString(), user.CompanyId)
        );
    }
}
