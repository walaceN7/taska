using Mediator;
using Taska.Core.Application.Interfaces;
using Taska.Shared.Exceptions;

namespace Taska.Core.Application.Features.Checklists.Commands;

public class ToggleChecklistItemCommandHandler(IChecklistItemRepository repository) : IRequestHandler<ToggleChecklistItemCommand, bool>
{
    public async ValueTask<bool> Handle(ToggleChecklistItemCommand request, CancellationToken cancellationToken)
    {
        var result = await repository.ChangeStatusAsync(request.Id, cancellationToken);

        if (result == false) throw new NotFoundException("Checklist item not found.");        

        return true;
    }
}
