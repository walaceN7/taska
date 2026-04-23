using Mediator;

namespace Taska.Identity.Application.Features.Users.Commands;

public record ResetPasswordCommand(string Email, string Token, string NewPassword) : IRequest;
