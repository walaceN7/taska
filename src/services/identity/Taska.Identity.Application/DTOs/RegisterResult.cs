namespace Taska.Identity.Application.DTOs;

public record RegisterResult(Guid UserId, string Email, string FullName);