using Taska.Core.Domain.Enums;

namespace Taska.Core.Domain.Entities;

public class ProjectMember
{
    public Guid ProjectId { get; set; }
    public Project Project { get; set; } = null!;
    public Guid UserId { get; set; }
    public ProjectRole Role { get; set; }
    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
}