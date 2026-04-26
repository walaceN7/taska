using Mediator;
using Taska.Core.Application.Features.Teams.DTOs;

namespace Taska.Core.Application.Features.Teams.Queries;

public record GetTeamsQuery() : IRequest<IEnumerable<TeamResult>>;

