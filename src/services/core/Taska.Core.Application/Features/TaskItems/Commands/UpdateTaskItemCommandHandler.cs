using Mapster;
using Mediator;
using Taska.Core.Application.Features.TaskItems.DTOs;
using Taska.Core.Application.Interfaces;
using Taska.Shared.Exceptions;

namespace Taska.Core.Application.Features.TaskItems.Commands;

public class UpdateTaskItemCommandHandler(ITaskItemRepository repository) : IRequestHandler<UpdateTaskItemCommand, TaskItemResult>
{
    public async ValueTask<TaskItemResult> Handle(UpdateTaskItemCommand request, CancellationToken cancellationToken)
    {
        var taskItem = await repository.GetByIdAsync(request.Id, cancellationToken) ?? throw new NotFoundException($"Task item not found.");

        taskItem.Title = request.Title;
        taskItem.Description = request.Description;
        taskItem.DueDate = request.DueDate;
        taskItem.Priority = request.Priority;

        await repository.UpdateAsync(taskItem, cancellationToken);

        return taskItem.Adapt<TaskItemResult>();
    }
}
