using Mapster;
using Mediator;
using Taska.Core.Application.Features.TaskItems.DTOs;
using Taska.Core.Application.Interfaces;

namespace Taska.Core.Application.Features.TaskItems.Queries;

public class GetTasksByColumnQueryHandler(ITaskItemRepository repository) : IRequestHandler<GetTasksByColumnQuery, IEnumerable<TaskItemResult>>
{
    public async ValueTask<IEnumerable<TaskItemResult>> Handle(GetTasksByColumnQuery request, CancellationToken cancellationToken)
    {
        var taskItems = await repository.GetByColumnIdAsync(request.ColumnId, cancellationToken);
        return taskItems.Adapt<IEnumerable<TaskItemResult>>();
    }
}
