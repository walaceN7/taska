namespace Taska.Shared.Events;

public record CompanyCreatedEvent(Guid UserId, Guid CompanyId);
