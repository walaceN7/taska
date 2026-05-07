namespace Taska.Shared.Events;

public record TaskAssignedEvent(Guid TaskId, string TaskTitle, Guid BoardId, Guid AssignedUserId, Guid ActorUserId, string ActorName, DateTime AssignedAt);
