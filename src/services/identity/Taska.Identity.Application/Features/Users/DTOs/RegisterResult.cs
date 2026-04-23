namespace Taska.Identity.Application.Features.Users.DTOs;

public record RegisterResult(string AccessToken, string RefreshToken, DateTime RefreshTokenExpiresAt, UserDto User);