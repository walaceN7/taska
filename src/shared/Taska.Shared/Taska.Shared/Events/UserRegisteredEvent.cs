using Taska.Shared.Enums;

namespace Taska.Shared.Events;

public record UserRegisteredEvent(Guid UserId, string CompanyName, CompanyPlan PlanId);
