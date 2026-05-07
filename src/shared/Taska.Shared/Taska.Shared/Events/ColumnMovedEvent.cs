namespace Taska.Shared.Events;

public record ColumnMovedEvent(Guid ColumnId, Guid BoardId, int NewOrder, Guid ActorUserId, DateTime MovedAt);
