using Mapster;
using Mediator;
using Taska.Core.Application.Features.Columns.DTOs;
using Taska.Core.Application.Interfaces;
using Taska.Shared.Exceptions;

namespace Taska.Core.Application.Features.Columns.Commands;

public class UpdateColumnCommandHandler(IColumnRepository repository) : IRequestHandler<UpdateColumnCommand, ColumnResult>
{
    public async ValueTask<ColumnResult> Handle(UpdateColumnCommand request, CancellationToken cancellationToken)
    {
        var column = await repository.GetByIdAsync(request.Id, cancellationToken) ?? throw new NotFoundException($"Column not found.");

        column.Name = request.Name;

        await repository.UpdateAsync(column, cancellationToken);

        return column.Adapt<ColumnResult>();
    }
}
