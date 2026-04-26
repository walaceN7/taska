namespace Taska.Core.Application.Features.Teams.DTOs;

public record TeamResult(Guid Id, string Name, string? Description, Guid CompanyId, int MemberCount);
