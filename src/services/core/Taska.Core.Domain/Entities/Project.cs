using Taska.Core.Domain.Enums;

namespace Taska.Core.Domain.Entities;

public class Project : BaseEntity
{
    public required string Name { get; set; }
    public string? Description { get; set; }
    public Guid CompanyId { get; set; }
    public Company Company { get; set; } = null!;
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public ProjectStatus Status { get; set; }
    public ICollection<ProjectMember> ProjectMembers { get; set; } = [];
    public ICollection<Board> Boards { get; set; } = [];
}