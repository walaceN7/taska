using Mapster;
using Mediator;
using Taska.Core.Application.Features.Projects.DTOs;
using Taska.Core.Application.Interfaces;
using Taska.Core.Domain.Entities;
using Taska.Shared.Exceptions;

namespace Taska.Core.Application.Features.Projects.Commands;

public class AddProjectMemberCommandHandler(IProjectRepository projectRepository) : IRequestHandler<AddProjectMemberCommand, ProjectResult>
{  
    public async ValueTask<ProjectResult> Handle(AddProjectMemberCommand request, CancellationToken cancellationToken)
    {
        var project = await projectRepository.GetByIdAsync(request.ProjectId, cancellationToken) ?? throw new NotFoundException($"Project {request.ProjectId} not found");

        var isMember = await projectRepository.IsMemberAsync(request.ProjectId, request.UserId, cancellationToken);
        if (isMember)
            throw new ValidationException("User is already a member of this project");

        var member = new ProjectMember
        {
            ProjectId = request.ProjectId,
            UserId = request.UserId,
            Role = request.Role,
            JoinedAt = DateTime.UtcNow
        };

        await projectRepository.AddMemberAsync(member, cancellationToken);

        return project.Adapt<ProjectResult>();
    }
}
