using Mediator;
using Taska.Core.Application.Interfaces;
using Taska.Shared.Exceptions;

namespace Taska.Core.Application.Features.Checklists.Commands;

public class DeleteChecklistItemCommandHandler(IChecklistItemRepository repository) : IRequestHandler<DeleteChecklistItemCommand, bool>
{
    public async ValueTask<bool> Handle(DeleteChecklistItemCommand request, CancellationToken cancellationToken)
    {
        var result = await repository.DeleteAsync(request.Id, cancellationToken);

        if (!result) throw new NotFoundException("Checklist item not found.");

        return result;
    }
}
