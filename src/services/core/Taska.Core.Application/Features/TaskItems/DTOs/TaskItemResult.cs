using Taska.Core.Domain.Enums;

namespace Taska.Core.Application.Features.TaskItems.DTOs;

public class TaskItemResult
{
    public Guid Id { get; set; }
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public DateTime? DueDate { get; set; }
    public TaskPriority Priority { get; set; }
    public TaskType Type { get; set; }
    public int? StoryPoints { get; set; }
    public int Order { get; set; }
    public Guid ColumnId { get; set; }
}
