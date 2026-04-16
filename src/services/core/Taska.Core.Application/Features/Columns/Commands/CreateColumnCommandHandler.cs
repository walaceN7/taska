using Mapster;
using Mediator;
using Taska.Core.Application.Features.Columns.DTOs;
using Taska.Core.Application.Interfaces;
using Taska.Core.Domain.Entities;

namespace Taska.Core.Application.Features.Columns.Commands;

public class CreateColumnCommandHandler(IColumnRepository repository) : IRequestHandler<CreateColumnCommand, ColumnResult>
{
    public async ValueTask<ColumnResult> Handle(CreateColumnCommand request, CancellationToken cancellationToken)
    {
        var nextOrder = await repository.GetNextOrderAsync(request.BoardId, cancellationToken);

        var column = request.Adapt<Column>();

        column.Order = nextOrder;

        var created = await repository.AddAsync(column, cancellationToken);

        return created.Adapt<ColumnResult>();
    }
}