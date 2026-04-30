namespace Taska.Shared.Events;

public record ColumnCreatedEvent(Guid ColumnId, Guid BoardId, string Name, int Order, Guid UserId, DateTime CreatedAt);
