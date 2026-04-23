using Mediator;

namespace Taska.Identity.Application.Features.Users.Commands;

public record EnableTwoFactorCommand(string Code) : IRequest;
