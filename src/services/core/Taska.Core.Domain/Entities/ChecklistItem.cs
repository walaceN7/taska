namespace Taska.Core.Domain.Entities;

public class ChecklistItem : BaseEntity
{
    public required string Title { get; set; }
    public bool IsCompleted { get; set; } = false;
    public int Order { get; set; }
    public Guid TaskId { get; set; }
    public TaskItem Task { get; set; } = null!;
}
