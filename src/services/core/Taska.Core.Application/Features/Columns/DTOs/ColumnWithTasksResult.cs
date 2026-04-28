using Taska.Core.Application.Features.TaskItems.DTOs;

namespace Taska.Core.Application.Features.Columns.DTOs;

public record ColumnWithTasksResult(
    Guid Id,
    string Name,
    int Order,
    List<TaskItemResult> Tasks
);