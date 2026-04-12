using MediatR;
using Microsoft.AspNetCore.Identity;
using Taska.Identity.Application.DTOs;
using Taska.Identity.Application.Interfaces;
using Taska.Identity.Domain.Entities;

namespace Taska.Identity.Application.Commands;

public class RefreshTokenCommandHandler(IRefreshTokenRepository refreshTokenRepository, UserManager<User> userManager, IJwtService jwtService) : IRequestHandler<RefreshTokenCommand, LoginResult>
{
    private readonly IRefreshTokenRepository _refreshTokenRepository = refreshTokenRepository;
    private readonly UserManager<User> _userManager = userManager;
    private readonly IJwtService _jwtService = jwtService;

    public async Task<LoginResult> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        var refreshToken = await _refreshTokenRepository.GetByTokenAsync(request.RefreshToken, cancellationToken);

        if (refreshToken == null || refreshToken.IsRevoked || refreshToken.ExpiresAt < DateTime.UtcNow)
            throw new Exception("Invalid or expired refresh token");

        await _refreshTokenRepository.RevokeAsync(refreshToken, cancellationToken);

        var newAccessToken = _jwtService.GenerateAccessToken(refreshToken.User);
        var newRefreshToken = _jwtService.GenerateRefreshToken();

        await _refreshTokenRepository.AddAsync(new RefreshToken
        {
            Id = Guid.NewGuid(),
            Token = newRefreshToken,
            UserId = refreshToken.UserId,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            IsRevoked = false
        }, cancellationToken);

        return new LoginResult(
            newAccessToken,
            newRefreshToken,
            DateTime.UtcNow.AddMinutes(15),
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