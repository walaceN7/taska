using Mediator;
using Taska.Core.Application.Interfaces;
using Taska.Shared.Exceptions;

namespace Taska.Core.Application.Features.Columns.Commands;

public class DeleteColumnCommandHandler(IColumnRepository repository) : IRequestHandler< DeleteColumnCommand,bool>
{
    public async ValueTask<bool> Handle(DeleteColumnCommand request, CancellationToken cancellationToken)
    {
        var column = await repository.GetByIdAsync(request.Id, cancellationToken) ?? throw new NotFoundException("Column not found");
        var result = await repository.DeleteAsync(column, cancellationToken);

        return result;
    }
}
