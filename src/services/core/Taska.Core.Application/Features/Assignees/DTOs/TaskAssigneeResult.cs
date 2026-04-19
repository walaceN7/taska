namespace Taska.Core.Application.Features.Assignees.DTOs;

public class TaskAssigneeResult
{
    public Guid TaskId { get; set; }
    public Guid UserId { get; set; }
    public DateTime CreatedAt { get; set; }
}