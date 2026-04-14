using Mediator;
using Taska.Core.Application.Features.Projects.DTOs;
using Taska.Core.Domain.Enums;

namespace Taska.Core.Application.Features.Projects.Commands;

public record AddProjectMemberCommand(Guid ProjectId, Guid UserId, ProjectRole Role) : IRequest<ProjectResult>;

