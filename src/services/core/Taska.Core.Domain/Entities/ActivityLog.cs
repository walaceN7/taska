namespace Taska.Core.Domain.Entities;

public class ActivityLog : BaseEntity
{
    public required string Action { get; set; }
    public Guid TaskId { get; set; }
    public TaskItem Task { get; set; } = null!;
    public Guid UserId { get; set; }
}
