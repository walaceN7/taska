namespace Taska.Core.Application.Features.Comments.DTOs;

public class CommentResult
{
    public Guid Id { get; set; }
    public required string Content { get; set; }
    public Guid TaskId { get; set; }
    public Guid UserId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
