using Mediator;
using Taska.Identity.Application.Features.Users.DTOs;

namespace Taska.Identity.Application.Features.Users.Commands;

public record SetupTwoFactorCommand() : IRequest<SetupTwoFactorResult>;
