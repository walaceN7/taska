using Taska.Core.Domain.Enums;

namespace Taska.Core.Domain.Entities;

public class Company : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? LogoUrl { get; set; }
    public string? Domain { get; set; }
    public CompanyPlan Plan { get; set; }
    public ICollection<Project> Projects { get; set; } = [];
    public ICollection<Team> Teams { get; set; } = [];
}