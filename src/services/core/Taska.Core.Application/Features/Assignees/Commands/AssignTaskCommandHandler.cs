using Mapster;
using Mediator;
using Taska.Core.Application.Features.Assignees.DTOs;
using Taska.Core.Application.Interfaces;
using Taska.Core.Domain.Entities;
using Taska.Shared.Exceptions;

namespace Taska.Core.Application.Features.Assignees.Commands;

public class AssignTaskCommandHandler(ITaskAssigneeRepository repository) : IRequestHandler<AssignTaskCommand, TaskAssigneeResult>
{
    public async ValueTask<TaskAssigneeResult> Handle(AssignTaskCommand request, CancellationToken cancellationToken)
    {
        var alreadyAssigned = await repository.ExistsAsync(request.TaskId, request.UserId, cancellationToken);
        if (alreadyAssigned)
            throw new ValidationException("User is already assigned to this task.");

        var assignee = new TaskAssignee
        {
            TaskId = request.TaskId,
            UserId = request.UserId
        };

        var created = await repository.AddAsync(assignee, cancellationToken);
        return created.Adapt<TaskAssigneeResult>();
    }
}