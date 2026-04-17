using Mediator;
using Taska.Core.Application.Features.TaskItems.DTOs;
using Taska.Core.Domain.Enums;

namespace Taska.Core.Application.Features.TaskItems.Commands;

public record CreateTaskItemCommand(string Title, string? Description, DateTime? DueDate, TaskPriority Priority, TaskType Type, int? StoryPoints, Guid ColumnId) : IRequest<TaskItemResult>;
