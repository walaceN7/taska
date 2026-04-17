using Mapster;
using Mediator;
using Taska.Core.Application.Features.TaskItems.DTOs;
using Taska.Core.Application.Interfaces;
using Taska.Core.Domain.Entities;

namespace Taska.Core.Application.Features.TaskItems.Commands;

public class CreateTaskItemCommandHandler(ITaskItemRepository repository) : IRequestHandler<CreateTaskItemCommand, TaskItemResult>
{
    public async ValueTask<TaskItemResult> Handle(CreateTaskItemCommand request, CancellationToken cancellationToken)
    {
        var nextOrder = await repository.GetNextOrderAsync(request.ColumnId, cancellationToken);

        var taskItem = request.Adapt<TaskItem>();
        taskItem.Order = nextOrder;

        var created = await repository.AddAsync(taskItem, cancellationToken);
        return created.Adapt<TaskItemResult>();
    }
}
