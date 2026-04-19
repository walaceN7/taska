using Mapster;
using Mediator;
using Taska.Core.Application.Features.TaskItems.DTOs;
using Taska.Core.Application.Interfaces;
using Taska.Shared.Exceptions;

namespace Taska.Core.Application.Features.TaskItems.Queries;

public class GetTaskItemByIdQueryHandler(ITaskItemRepository repository) : IRequestHandler<GetTaskItemByIdQuery, TaskItemResult>
{
    public async ValueTask<TaskItemResult> Handle(GetTaskItemByIdQuery request, CancellationToken cancellationToken)
    {
        var taskItem = await repository.GetByIdAsync(request.Id, cancellationToken) ?? throw new NotFoundException($"Task item not found.");

        return taskItem.Adapt<TaskItemResult>();
    }
}
