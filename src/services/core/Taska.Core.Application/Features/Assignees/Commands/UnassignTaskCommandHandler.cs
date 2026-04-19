using Mediator;
using Taska.Core.Application.Interfaces;
using Taska.Shared.Exceptions;

namespace Taska.Core.Application.Features.Assignees.Commands;

public class UnassignTaskCommandHandler(ITaskAssigneeRepository repository) : IRequestHandler<UnassignTaskCommand, bool>
{
    public async ValueTask<bool> Handle(UnassignTaskCommand request, CancellationToken cancellationToken)
    {
        var result = await repository.RemoveAsync(request.TaskId, request.UserId, cancellationToken);

        if (!result)
            throw new NotFoundException("Assignee not found on this task.");

        return true;
    }
}