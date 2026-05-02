using Mediator;
using Microsoft.AspNetCore.Identity;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Text.Json.Serialization;
using Taska.Identity.Application.Features.Users.DTOs;
using Taska.Identity.Application.Interfaces;
using Taska.Identity.Domain.Entities;
using Taska.Shared.Enums;
using Taska.Shared.Exceptions;

namespace Taska.Identity.Application.Features.Users.Commands;

public class GoogleLoginCommandHandler(UserManager<User> userManager, IJwtService jwtService, IRefreshTokenRepository refreshTokenRepository, IHttpClientFactory httpClientFactory) : IRequestHandler<GoogleLoginCommand, LoginResult>
{
    public async ValueTask<LoginResult> Handle(GoogleLoginCommand request, CancellationToken cancellationToken)
    {
        var googleUser = await GetGoogleUserInfoAsync(request.AccessToken, cancellationToken);
        if (googleUser == null || string.IsNullOrEmpty(googleUser.Email))
            throw new UnauthorizedException("Google Token invalid or expired.");

        var user = await userManager.FindByEmailAsync(googleUser.Email);

        if (user == null)
        {
            user = new User
            {
                UserName = googleUser.Email,
                Email = googleUser.Email,
                FirstName = googleUser.GivenName ?? "User",
                LastName = googleUser.FamilyName ?? "",
                AvatarUrl = googleUser.Picture,                
                SystemRole = SystemRole.CompanyAdmin, 
                CompanyId = null,
                EmailConfirmed = true,
                CreatedAt = DateTime.UtcNow,
                LastLoginAt = DateTime.UtcNow
            };

            var createResult = await userManager.CreateAsync(user);
            if (!createResult.Succeeded)
                throw new UnauthorizedException("Failed to create user via Google SSO.");
        }
        else
        {
            user.LastLoginAt = DateTime.UtcNow;
            await userManager.UpdateAsync(user);
        }

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
            new UserDto(
                user.Id,
                $"{user.FirstName} {user.LastName}".Trim(),
                user.Email!,
                user.AvatarUrl,
                user.SystemRole.ToString(),
                user.CompanyId
            ),
            RequiresTwoFactor: false,
            TwoFactorToken: null
        );
    }

    private async Task<GoogleUserInfo?> GetGoogleUserInfoAsync(string accessToken, CancellationToken cancellationToken)
    {
        var client = httpClientFactory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

        var response = await client.GetAsync("https://www.googleapis.com/oauth2/v3/userinfo", cancellationToken);

        if (!response.IsSuccessStatusCode)
            return null;

        var content = await response.Content.ReadAsStringAsync(cancellationToken);
        return JsonSerializer.Deserialize<GoogleUserInfo>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
    }

    public record GoogleUserInfo(
        [property: JsonPropertyName("email")] string Email,
        [property: JsonPropertyName("given_name")] string? GivenName,
        [property: JsonPropertyName("family_name")] string? FamilyName,
        [property: JsonPropertyName("picture")] string? Picture
    );
}
