using Mediator;
using Taska.Core.Application.Features.Teams.DTOs;

namespace Taska.Core.Application.Features.Teams.Commands;

public record CreateTeamCommand(string Name, string? Description) : IRequest<TeamResult>;
