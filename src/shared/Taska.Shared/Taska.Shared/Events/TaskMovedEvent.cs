namespace Taska.Shared.Events;

public record TaskMovedEvent(Guid TaskId, string TaskTitle, Guid BoardId, Guid FromColumnId, Guid ToColumnId, int NewOrder, Guid ActorUserId, string ActorName, List<Guid> RecipientUserIds, DateTime MovedAt);

