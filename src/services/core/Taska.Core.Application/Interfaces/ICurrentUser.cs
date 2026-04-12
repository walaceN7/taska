namespace Taska.Core.Application.Interfaces;

public interface ICurrentUser
{
    Guid UserId { get; }
    Guid? CompanyId { get; }
    string Email { get; }
    string SystemRole { get; }
}