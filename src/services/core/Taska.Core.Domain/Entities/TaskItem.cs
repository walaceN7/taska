
using Taska.Core.Domain.Enums;

namespace Taska.Core.Domain.Entities;

public class TaskItem : BaseEntity
{
    public required string Title { get; set; }
    public string? Description { get; set; }
    public DateTime? DueDate { get; set; }
    public TaskPriority Priority { get; set; }
    public TaskType Type { get; set; }
    public int? StoryPoints { get; set; }
    public int Order { get; set; }
    public Guid ColumnId { get; set; }
    public Column Column { get; set; } = null!;
    public ICollection<TaskAssignee> TaskAssignees { get; set; } = [];
    public ICollection<Comment> Comments { get; set; } = [];
    public ICollection<ChecklistItem> ChecklistItems { get; set; } = [];
    public ICollection<Attachment> Attachments { get; set; } = [];
    public ICollection<ActivityLog> ActivityLogs { get; set; } = [];
}
