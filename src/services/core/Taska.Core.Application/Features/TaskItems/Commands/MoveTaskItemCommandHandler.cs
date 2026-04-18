using Mapster;
using Mediator;
using Taska.Core.Application.Features.TaskItems.DTOs;
using Taska.Core.Application.Interfaces;
using Taska.Shared.Exceptions;

namespace Taska.Core.Application.Features.TaskItems.Commands;

public class MoveTaskItemCommandHandler(ITaskItemRepository repository) : IRequestHandler<MoveTaskItemCommand, TaskItemResult>
{
    public async ValueTask<TaskItemResult> Handle(MoveTaskItemCommand request, CancellationToken cancellationToken)
    {
        var task = await repository.GetByIdAsync(request.TaskId, cancellationToken) ?? throw new NotFoundException("Task not found");
                
        if (task.ColumnId == request.NewColumnId)
        {
            if (task.Order == request.NewOrder)
                return task.Adapt<TaskItemResult>();

            if (request.NewOrder > task.Order)
            {                
                await repository.ShiftOrdersAsync(task.ColumnId, task.Order + 1, request.NewOrder, -1, cancellationToken);
            }
            else
            {                
                await repository.ShiftOrdersAsync(task.ColumnId, request.NewOrder, task.Order - 1, 1, cancellationToken);
            }
        }        
        else
        {            
            await repository.ShiftOrdersAsync(task.ColumnId, task.Order + 1, null, -1, cancellationToken);
                        
            await repository.ShiftOrdersAsync(request.NewColumnId, request.NewOrder, null, 1, cancellationToken);
                        
            task.ColumnId = request.NewColumnId;
        }
                
        task.Order = request.NewOrder;
        var updatedTask = await repository.UpdateAsync(task, cancellationToken);

        return updatedTask.Adapt<TaskItemResult>();
    }
}