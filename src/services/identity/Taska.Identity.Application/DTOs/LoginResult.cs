namespace Taska.Identity.Application.DTOs;

public record LoginResult(string AccessToken, string RefreshToken, DateTime ExpiresAt, UserDto User);

public record UserDto(Guid UserId, string FullName, string Email, string? AvatarUrl, string SystemRole, Guid? CompanyId);