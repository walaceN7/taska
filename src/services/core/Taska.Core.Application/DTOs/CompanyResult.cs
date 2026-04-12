namespace Taska.Core.Application.DTOs;

public record CompanyResult(Guid Id, string Name, string? LogoUrl, string? Domain, string Plan);