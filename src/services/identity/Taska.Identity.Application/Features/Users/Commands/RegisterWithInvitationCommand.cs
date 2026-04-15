using Mediator;
using Taska.Identity.Application.Features.Users.DTOs;

namespace Taska.Identity.Application.Features.Users.Commands;

public record RegisterWithInvitationCommand(string Token, string FirstName, string LastName, string Password) : IRequest<RegisterResult>;
