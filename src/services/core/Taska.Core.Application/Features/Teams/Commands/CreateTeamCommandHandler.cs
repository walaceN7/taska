using Mapster;
using Mediator;
using Taska.Core.Application.Features.Teams.DTOs;
using Taska.Core.Application.Interfaces;
using Taska.Core.Domain.Entities;
using Taska.Shared.Exceptions;

namespace Taska.Core.Application.Features.Teams.Commands;

public class CreateTeamCommandHandler(ITeamRepository repository, ICurrentUser currentUser) : IRequestHandler<CreateTeamCommand, TeamResult>
{
    public async ValueTask<TeamResult> Handle(CreateTeamCommand request, CancellationToken cancellationToken)
    {
        var team = request.Adapt<Team>();
        team.CompanyId = currentUser.CompanyId ?? throw new UnauthorizedException("User does not belong to a company");

        var createdTeam = await repository.AddAsync(team, cancellationToken);

        return createdTeam.Adapt<TeamResult>();
    }
}
