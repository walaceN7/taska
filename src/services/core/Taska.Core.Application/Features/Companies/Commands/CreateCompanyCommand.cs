using Mediator;
using Taska.Core.Application.Features.Companies.DTOs;

namespace Taska.Core.Application.Features.Companies.Commands;

public record CreateCompanyCommand(string Name, string? LogoUrl, string? Domain) : IRequest<CompanyResult>;