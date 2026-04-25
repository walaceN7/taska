namespace Taska.Identity.Application.Features.Users.DTOs;

public record MemberDto(Guid Id, String FullName, String Email, String? AvatarUrl, String SystemRole);
