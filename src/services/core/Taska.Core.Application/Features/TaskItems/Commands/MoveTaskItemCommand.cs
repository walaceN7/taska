using Mediator;
using Taska.Core.Application.Features.TaskItems.DTOs;

namespace Taska.Core.Application.Features.TaskItems.Commands;

public record MoveTaskItemCommand(Guid TaskId, Guid NewColumnId, int NewOrder) : IRequest<TaskItemResult>;