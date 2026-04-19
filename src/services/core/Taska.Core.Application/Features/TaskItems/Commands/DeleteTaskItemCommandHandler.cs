using Mediator;
using Taska.Core.Application.Interfaces;
using Taska.Shared.Exceptions;

namespace Taska.Core.Application.Features.TaskItems.Commands;

public class DeleteTaskItemCommandHandler(ITaskItemRepository repository) : IRequestHandler<DeleteTaskItemCommand, bool>
{
    public async ValueTask<bool> Handle(DeleteTaskItemCommand request, CancellationToken cancellationToken)
    {
        var result =  await repository.DeleteAsync(request.Id, cancellationToken);
        if (!result) throw new NotFoundException($"Task item not found.");

        return result;
    }
}
