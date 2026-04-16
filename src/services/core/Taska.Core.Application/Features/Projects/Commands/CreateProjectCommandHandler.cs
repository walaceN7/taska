using Mapster;
using Mediator;
using Taska.Core.Application.Features.Projects.DTOs;
using Taska.Core.Application.Interfaces;
using Taska.Core.Domain.Entities;
using Taska.Shared.Exceptions;

namespace Taska.Core.Application.Features.Projects.Commands;

public class CreateProjectCommandHandler(IProjectRepository projectRepository, ICurrentUser currentUser) : IRequestHandler<CreateProjectCommand, ProjectResult>
{
    public async ValueTask<ProjectResult> Handle(CreateProjectCommand request, CancellationToken cancellationToken)
    {
        var project = request.Adapt<Project>();
        project.CompanyId = currentUser.CompanyId 
            ?? throw new UnauthorizedException("User does not belong to a company");

        var createdProject = await projectRepository.AddAsync(project, cancellationToken);
        return createdProject.Adapt<ProjectResult>();
    }
}
