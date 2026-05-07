namespace Taska.Shared.Events;

public record TaskCreatedEvent(Guid TaskId, string TaskTitle, Guid BoardId, Guid ColumnId, string? Description, int Priority, int Type, int Order, Guid ActorUserId, string ActorName, List<Guid> RecipientUserIds, DateTime CreatedAt);
