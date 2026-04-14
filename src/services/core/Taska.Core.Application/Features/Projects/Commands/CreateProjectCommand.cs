using Mediator;
using Taska.Core.Application.Features.Projects.DTOs;

namespace Taska.Core.Application.Features.Projects.Commands;

public record CreateProjectCommand(string Name, string? Description, DateTime? StartDate, DateTime? EndDate) : IRequest<ProjectResult>;
