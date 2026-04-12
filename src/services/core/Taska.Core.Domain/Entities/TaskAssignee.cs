namespace Taska.Core.Domain.Entities;

public class TaskAssignee
{
    public Guid TaskId { get; set; }
    public TaskItem Task { get; set; } = null!;
    public Guid UserId { get; set; }
    public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
}
