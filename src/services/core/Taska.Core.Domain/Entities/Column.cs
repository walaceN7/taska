namespace Taska.Core.Domain.Entities;

public class Column : BaseEntity
{
    public required string Name { get; set; }
    public int Order { get; set; }
    public Guid BoardId { get; set; }
    public Board Board { get; set; } = null!;
    public ICollection<TaskItem> Tasks { get; set; } = [];
}
