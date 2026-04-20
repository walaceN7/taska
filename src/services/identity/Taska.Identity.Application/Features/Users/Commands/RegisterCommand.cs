using Mediator;
using Taska.Identity.Application.Features.Users.DTOs;

namespace Taska.Identity.Application.Features.Users.Commands;

public record RegisterCommand(string FirstName, string LastName, string Email, string Password) : IRequest<RegisterResult>;