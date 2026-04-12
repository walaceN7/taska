using System.Net.Mime;

namespace Taska.Core.Domain.Entities;

public class Attachment : BaseEntity
{
    public required string FileName { get; set; }
    public required string FileUrl { get; set; }
    public long FileSize { get; set; }
    public required string ContentType { get; set; }
    public Guid TaskId { get; set; }
    public TaskItem Task { get; set; } = null!;
    public Guid UserId { get; set; }
}
