using Mapster;
using MassTransit;
using Mediator;
using Taska.Core.Application.Features.Columns.DTOs;
using Taska.Core.Application.Interfaces;
using Taska.Shared.Events;
using Taska.Shared.Exceptions;

namespace Taska.Core.Application.Features.Columns.Commands;

public class MoveColumnCommandHandler(IColumnRepository repository, ICurrentUser currentUser, IPublishEndpoint publishEndpoint) : IRequestHandler<MoveColumnCommand, ColumnResult>
{
    public async ValueTask<ColumnResult> Handle(MoveColumnCommand request, CancellationToken cancellationToken)
    {
        var column = await repository.GetByIdAsync(request.ColumnId, cancellationToken) ?? throw new NotFoundException("Column not found");

        if (column.Order == request.NewOrder)
            return column.Adapt<ColumnResult>();
                
        if (request.NewOrder > column.Order)
        {
            await repository.ShiftOrdersAsync(column.BoardId, column.Order + 1, request.NewOrder, -1, cancellationToken);
        }
        else
        {
            await repository.ShiftOrdersAsync(column.BoardId, request.NewOrder, column.Order - 1, 1, cancellationToken);
        }

        column.Order = request.NewOrder;
        var updatedColumn = await repository.UpdateAsync(column, cancellationToken);
                
        await publishEndpoint.Publish(new ColumnMovedEvent(
            column.Id,
            column.BoardId,
            column.Order,
            currentUser.UserId,
            DateTime.UtcNow), cancellationToken);

        return updatedColumn.Adapt<ColumnResult>();
    }
}
