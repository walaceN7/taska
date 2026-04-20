using Mapster;
using Mediator;
using Taska.Core.Application.Features.Assignees.DTOs;
using Taska.Core.Application.Interfaces;

namespace Taska.Core.Application.Features.Assignees.Queries;

public class GetAssigneesByTaskQueryHandler(ITaskAssigneeRepository repository) : IRequestHandler<GetAssigneesByTaskQuery, List<TaskAssigneeResult>>
{
    public async ValueTask<List<TaskAssigneeResult>> Handle(GetAssigneesByTaskQuery request, CancellationToken cancellationToken)
    {
        var assignees = await repository.GetByTaskIdAsync(request.TaskId, cancellationToken);

        return assignees.Adapt<List<TaskAssigneeResult>>();
    }
}
