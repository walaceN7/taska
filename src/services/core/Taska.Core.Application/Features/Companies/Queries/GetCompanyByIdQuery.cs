using Mediator;
using Taska.Core.Application.Features.Companies.DTOs;

namespace Taska.Core.Application.Features.Companies.Queries;

public record GetCompanyByIdQuery(Guid Id) : IRequest<CompanyResult>;