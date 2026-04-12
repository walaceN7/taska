using Mediator;

namespace Taska.Identity.Application.Commands;

public record LogoutCommand(string RefreshToken) : IRequest;