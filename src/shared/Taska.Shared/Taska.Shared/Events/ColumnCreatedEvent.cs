namespace Taska.Shared.Events;

public record ColumnCreatedEvent(Guid ColumnId, Guid BoardId, string ColumnName, int Order, Guid ActorUserId, string ActorName, List<Guid> RecipientUserIds, DateTime CreatedAt);
