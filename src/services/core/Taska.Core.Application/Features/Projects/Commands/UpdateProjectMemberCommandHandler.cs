using Mapster;
using Mediator;
using Taska.Core.Application.Features.Projects.DTOs;
using Taska.Core.Application.Interfaces;
using Taska.Shared.Exceptions;

namespace Taska.Core.Application.Features.Projects.Commands;

public class UpdateProjectMemberCommandHandler(IProjectRepository repository) : IRequestHandler<UpdateProjectMemberCommand, ProjectResult>
{
    public async ValueTask<ProjectResult> Handle(UpdateProjectMemberCommand request, CancellationToken cancellationToken)
    {
        var project = await repository.GetByIdAsync(request.ProjectId, cancellationToken) ?? throw new NotFoundException($"Project {request.ProjectId} not found");

        var member = project.ProjectMembers.FirstOrDefault(m => m.UserId == request.UserId) ?? throw new NotFoundException($"Project member {request.UserId} not found in project {request.ProjectId}");

        await repository.UpdateMemberAsync(request.ProjectId, request.UserId, request.Role, cancellationToken);

        return project.Adapt<ProjectResult>();
    }
}
