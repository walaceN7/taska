namespace Taska.Core.Domain.Entities;

public class Comment : BaseEntity
{
    public required string Content { get; set; }
    public Guid TaskId { get; set; }
    public TaskItem Task { get; set; } = null!;
    public Guid UserId { get; set; }
}
