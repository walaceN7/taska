using Mediator;
using Taska.Core.Application.Features.Assignees.DTOs;

namespace Taska.Core.Application.Features.Assignees.Commands;

public record AssignTaskCommand(Guid TaskId, Guid UserId) : IRequest<TaskAssigneeResult>;