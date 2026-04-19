using Mapster;
using Mediator;
using Taska.Core.Application.Features.Checklists.DTOs;
using Taska.Core.Application.Interfaces;

namespace Taska.Core.Application.Features.Checklists.Queries;

public class GetChecklistsByTaskQueryHandler(IChecklistItemRepository repository) : IRequestHandler<GetChecklistsByTaskQuery, List<ChecklistItemResult>>
{
    public async ValueTask<List<ChecklistItemResult>> Handle(GetChecklistsByTaskQuery request, CancellationToken cancellationToken)
    {
        var result = await repository.GetByTaskIdAsync(request.TaskId, cancellationToken);

        return result.Adapt<List<ChecklistItemResult>>();
    }
}
