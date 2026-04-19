using Mapster;
using Mediator;
using Taska.Core.Application.Features.Checklists.DTOs;
using Taska.Core.Application.Interfaces;
using Taska.Core.Domain.Entities;

namespace Taska.Core.Application.Features.Checklists.Commands;

public class CreateChecklistItemCommandHandler(IChecklistItemRepository repository) : IRequestHandler<CreateChecklistItemCommand, ChecklistItemResult>
{
    public async ValueTask<ChecklistItemResult> Handle(CreateChecklistItemCommand request, CancellationToken cancellationToken)
    {
        var nextOrder = await repository.GetNextOrderAsync(request.TaskId, cancellationToken);

        var checklistItem = request.Adapt<ChecklistItem>();
        checklistItem.Order = nextOrder;

        var created = await repository.AddAsync(checklistItem, cancellationToken);

        return created.Adapt<ChecklistItemResult>();
    }
}
