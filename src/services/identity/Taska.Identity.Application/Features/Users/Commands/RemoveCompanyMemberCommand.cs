using Mediator;

namespace Taska.Identity.Application.Features.Users.Commands;

public record RemoveCompanyMemberCommand(Guid UserId) : IRequest;
