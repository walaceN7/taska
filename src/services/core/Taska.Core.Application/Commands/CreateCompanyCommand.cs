using Mediator;
using Taska.Core.Application.DTOs;

namespace Taska.Core.Application.Commands;

public record CreateCompanyCommand(string Name, string? LogoUrl, string? Domain) : IRequest<CompanyResult>;