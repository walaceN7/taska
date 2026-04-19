using Mediator;
using Taska.Core.Application.Features.TaskItems.DTOs;
using Taska.Core.Domain.Enums;

namespace Taska.Core.Application.Features.TaskItems.Commands;

public record UpdateTaskItemCommand(Guid Id, string Title, string? Description, DateTime? DueDate, TaskPriority Priority) : IRequest<TaskItemResult>;
