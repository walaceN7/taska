using Taska.Core.Domain.Interfaces;

namespace Taska.Core.Domain.Entities;

public class Team : BaseEntity, IMustHaveCompany
{
    public required string Name { get; set; }
    public string? Description { get; set; }
    public Guid CompanyId { get; set; }
    public Company Company { get; set; } = null!;
    public ICollection<TeamMember> TeamMembers { get; set; } = [];
}