using Mediator;
using Taska.Core.Application.Features.Projects.DTOs;
using Taska.Core.Domain.Enums;

namespace Taska.Core.Application.Features.Projects.Commands;

public record UpdateProjectCommand(Guid Id, string? Name, string? Description, DateTime? StartDate, DateTime? EndDate, ProjectStatus? Status) : IRequest<ProjectResult>;
