using Mediator;

namespace Taska.Identity.Application.Features.Users.Commands;

public record ForgotPasswordCommand(string Email) : IRequest;
