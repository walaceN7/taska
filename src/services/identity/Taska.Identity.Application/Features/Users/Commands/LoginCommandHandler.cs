using Mediator;
using Microsoft.AspNetCore.Identity;
using Taska.Identity.Application.Features.Users.DTOs;
using Taska.Identity.Application.Interfaces;
using Taska.Identity.Domain.Entities;
using Taska.Shared.Exceptions;

namespace Taska.Identity.Application.Features.Users.Commands;

public class LoginCommandHandler(UserManager<User> userManager, IJwtService jwtService, IRefreshTokenRepository refreshTokenRepository, ITurnstileService turnstileService) : IRequestHandler<LoginCommand, LoginResult>
{
    public async ValueTask<LoginResult> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var isHuman = await turnstileService.VerifyTokenAsync(request.TurnstileToken, cancellationToken);
        if (!isHuman)
            throw new UnauthorizedException("Falha na verificação de segurança (Bot detectado).");

        var user = await userManager.FindByEmailAsync(request.Email);
        if (user == null || !await userManager.CheckPasswordAsync(user, request.Password))
            throw new UnauthorizedException("Invalid credentials");

        if (await userManager.GetTwoFactorEnabledAsync(user))
        {
            var tempToken = await userManager.GenerateUserTokenAsync(user, "Default", "2FA-Auth");

            return new LoginResult(
                AccessToken: string.Empty,
                RefreshToken: string.Empty,
                AccessTokenExpiresAt: DateTime.MinValue,
                RefreshTokenExpiresAt: DateTime.MinValue,
                User: null,
                RequiresTwoFactor: true,
                TwoFactorToken: tempToken
            );
        }

        user.LastLoginAt = DateTime.UtcNow;
        await userManager.UpdateAsync(user);

        var accessToken = jwtService.GenerateAccessToken(user);
        var refreshToken = jwtService.GenerateRefreshToken();

        var refreshTokenExpiryDays = request.RememberMe ? 30 : 1;
        var refreshTokenExpiryDate = DateTime.UtcNow.AddDays(refreshTokenExpiryDays);

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
            new UserDto(
                user.Id,
                $"{user.FirstName} {user.LastName}",
                user.Email!,
                user.AvatarUrl,
                user.SystemRole.ToString(),
                user.CompanyId
            )
        );
    }
}