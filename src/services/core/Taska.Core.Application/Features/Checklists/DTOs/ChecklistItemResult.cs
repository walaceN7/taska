namespace Taska.Core.Application.Features.Checklists.DTOs;

public class ChecklistItemResult
{
    public required string Title { get; set; }
    public bool IsCompleted { get; set; }
    public int Order { get; set; }
    public Guid TaskId { get; set; }
}
