namespace Taska.Shared.Events;

public record TaskMovedEvent(Guid TaskId, Guid BoardId, Guid FromColumnId, Guid ToColumnId, int NewOrder, Guid UserId, DateTime MovedAt);

