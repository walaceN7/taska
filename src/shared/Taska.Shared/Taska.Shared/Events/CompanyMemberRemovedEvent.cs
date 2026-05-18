namespace Taska.Shared.Events;

public record CompanyMemberRemovedEvent(Guid CompanyId, Guid UserId, DateTime RemovedAt);
