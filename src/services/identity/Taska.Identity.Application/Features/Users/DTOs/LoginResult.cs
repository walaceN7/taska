namespace Taska.Identity.Application.Features.Users.DTOs;

public record LoginResult(string AccessToken, string RefreshToken, DateTime AccessTokenExpiresAt, DateTime RefreshTokenExpiresAt, UserDto User, bool RequiresTwoFactor = false, string? TwoFactorToken = null);

public record UserDto(Guid UserId, string FullName, string Email, string? AvatarUrl, string SystemRole, Guid? CompanyId);

public record SetupTwoFactorResult(string SharedKey, string AuthenticatorUri);