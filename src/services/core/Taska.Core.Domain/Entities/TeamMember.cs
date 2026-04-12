using Taska.Core.Domain.Enums;

namespace Taska.Core.Domain.Entities;

public class TeamMember
{
    public Guid TeamId { get; set; }
    public Team Team { get; set; } = null!;
    public Guid UserId { get; set; }
    public TeamRole Role { get; set; }
    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
}