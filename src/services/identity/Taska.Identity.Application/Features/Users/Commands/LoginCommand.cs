using Mediator;
using Taska.Identity.Application.Features.Users.DTOs;

namespace Taska.Identity.Application.Features.Users.Commands;

public record LoginCommand(string Email, string Password, string TurnstileToken, bool RememberMe) : IRequest<LoginResult>;