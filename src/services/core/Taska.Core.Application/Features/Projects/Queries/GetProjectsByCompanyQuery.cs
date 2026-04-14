using Mediator;
using Taska.Core.Application.Features.Projects.DTOs;

namespace Taska.Core.Application.Features.Projects.Queries;

public record GetProjectsByCompanyQuery() : IRequest<IEnumerable<ProjectResult>>;
