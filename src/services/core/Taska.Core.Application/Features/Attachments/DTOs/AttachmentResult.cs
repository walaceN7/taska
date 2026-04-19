namespace Taska.Core.Application.Features.Attachments.DTOs;

public class AttachmentResult
{
    public Guid Id { get; set; }
    public required string FileName { get; set; }
    public required string FileUrl { get; set; }
    public long FileSize { get; set; }
    public required string ContentType { get; set; }
    public Guid TaskId { get; set; }
    public Guid UserId { get; set; }
    public DateTime CreatedAt { get; set; }
}
