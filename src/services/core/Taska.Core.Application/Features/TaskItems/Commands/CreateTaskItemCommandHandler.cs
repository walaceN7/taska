using Mapster;
using MassTransit;
using Mediator;
using Taska.Core.Application.Features.TaskItems.DTOs;
using Taska.Core.Application.Interfaces;
using Taska.Core.Domain.Entities;
using Taska.Shared.Events;
using Taska.Shared.Exceptions;

namespace Taska.Core.Application.Features.TaskItems.Commands;

public class CreateTaskItemCommandHandler(ITaskItemRepository repository, IColumnRepository columnRepository, ICurrentUser currentUser, IPublishEndpoint publishEndpoint) : IRequestHandler<CreateTaskItemCommand, TaskItemResult>
{
    public async ValueTask<TaskItemResult> Handle(CreateTaskItemCommand request, CancellationToken cancellationToken)
    {
        var column = await columnRepository.GetByIdAsync(request.ColumnId, cancellationToken) ?? throw new NotFoundException("Column not found");

        var nextOrder = await repository.GetNextOrderAsync(request.ColumnId, cancellationToken);

        var taskItem = request.Adapt<TaskItem>();
        taskItem.Order = nextOrder;

        var created = await repository.AddAsync(taskItem, cancellationToken);

        await publishEndpoint.Publish(new TaskCreatedEvent(created.Id, column.BoardId, created.ColumnId, created.Title, created.Description, (int)created.Priority, (int)created.Type, created.Order, currentUser.UserId, created.CreatedAt), cancellationToken);
        return created.Adapt<TaskItemResult>();
    }
}
