using Taska.Shared.Enums;

namespace Taska.Identity.Application.Interfaces;

public interface ICurrentUser
{
    Guid UserId { get; }
    Guid? CompanyId { get; }
    string Email { get; }
    SystemRole SystemRole { get; }
}