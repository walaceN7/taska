namespace Taska.Core.Application.Features.Companies.DTOs;

public record CompanyResult(Guid Id, string Name, string? LogoUrl, string? Domain, string Plan);