namespace Taska.Shared.Events;

public record TaskCreatedEvent(Guid TaskId, Guid BoardId, Guid ColumnId, string Title, string? Description, int Priority, int Type, int Order, Guid UserId, DateTime CreatedAt);
