using Mapster;
using MassTransit;
using Mediator;
using Taska.Core.Application.Features.Columns.DTOs;
using Taska.Core.Application.Interfaces;
using Taska.Core.Domain.Entities;
using Taska.Shared.Events;

namespace Taska.Core.Application.Features.Columns.Commands;

public class CreateColumnCommandHandler(IColumnRepository repository, ICurrentUser currentUser, IPublishEndpoint publishEndpoint) : IRequestHandler<CreateColumnCommand, ColumnResult>
{
    public async ValueTask<ColumnResult> Handle(CreateColumnCommand request, CancellationToken cancellationToken)
    {
        var nextOrder = await repository.GetNextOrderAsync(request.BoardId, cancellationToken);

        var column = request.Adapt<Column>();
        column.BoardId = request.BoardId;
        column.Order = nextOrder;

        var created = await repository.AddAsync(column, cancellationToken);

        await publishEndpoint.Publish(new ColumnCreatedEvent(column.Id, column.BoardId, column.Name, column.Order, currentUser.UserId, column.CreatedAt), cancellationToken);

        return created.Adapt<ColumnResult>();
    }
}