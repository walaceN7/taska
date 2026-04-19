using Mediator;
using Taska.Core.Application.Interfaces;
using Taska.Shared.Exceptions;

namespace Taska.Core.Application.Features.Projects.Commands;

public class RemoveProjectMemberCommandHandler(IProjectRepository repository) : IRequestHandler<RemoveProjectMemberCommand, bool>
{
    public async ValueTask<bool> Handle(RemoveProjectMemberCommand request, CancellationToken cancellationToken)
    {
        var project = await repository.GetByIdAsync(request.ProjectId, cancellationToken) ?? throw new NotFoundException("Project not found.");

        await repository.RemoveMemberAsync(project, request.UserId, cancellationToken);
        return true;
    }
}
