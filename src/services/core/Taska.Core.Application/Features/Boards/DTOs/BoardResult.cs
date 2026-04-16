using Taska.Core.Domain.Enums;

namespace Taska.Core.Application.Features.Boards.DTOs;

public class BoardResult
{
    public Guid Id { get; set; }
    public Guid ProjectId { get; set; }
    public string Name { get; set; } = null!;
    public BoardType Type { get; set; }
}
