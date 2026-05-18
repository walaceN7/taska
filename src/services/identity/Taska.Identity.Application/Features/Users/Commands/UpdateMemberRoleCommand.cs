using Mediator;
using Taska.Shared.Enums;

namespace Taska.Identity.Application.Features.Users.Commands;

public record UpdateMemberRoleCommand(Guid UserId, SystemRole Role) : IRequest;
