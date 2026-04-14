using Mediator;

namespace Taska.Identity.Application.Features.RefreshTokens.Commands;

public record LogoutCommand(string RefreshToken) : IRequest;