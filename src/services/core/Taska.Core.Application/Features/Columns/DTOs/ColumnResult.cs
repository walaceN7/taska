namespace Taska.Core.Application.Features.Columns.DTOs;

public class ColumnResult
{
    public Guid Id { get; set; }
    public Guid BoardId { get; set; }
    public string Name { get; set; } = null!;
    public int Order { get; set; }
}