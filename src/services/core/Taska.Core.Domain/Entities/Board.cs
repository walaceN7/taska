using Taska.Core.Domain.Enums;

namespace Taska.Core.Domain.Entities;

public class Board : BaseEntity
{
    public required string Name { get; set; }
    public BoardType Type { get; set; }
    public Guid ProjectId { get; set; }
    public Project Project { get; set; } = null!;
    public ICollection<Column> Columns { get; set; } = [];
}
