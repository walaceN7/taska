using Mediator;
using Taska.Identity.Application.Features.Users.DTOs;

namespace Taska.Identity.Application.Features.RefreshTokens.Commands;

public record RefreshTokenCommand(string RefreshToken) : IRequest<LoginResult>;