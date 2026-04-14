namespace Taska.Identity.Application.Features.Users.DTOs;

public record RegisterResult(Guid UserId, string Email, string FullName);