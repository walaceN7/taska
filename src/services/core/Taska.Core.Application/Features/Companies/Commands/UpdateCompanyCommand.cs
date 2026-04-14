using Mediator;
using Taska.Core.Application.Features.Companies.DTOs;

namespace Taska.Core.Application.Features.Companies.Commands;

public record UpdateCompanyCommand(Guid Id, string? Name, string? LogoUrl) : IRequest<CompanyResult>;
