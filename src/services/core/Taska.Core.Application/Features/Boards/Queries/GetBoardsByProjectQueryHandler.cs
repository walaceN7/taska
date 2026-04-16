using Mapster;
using Mediator;
using Taska.Core.Application.Features.Boards.DTOs;
using Taska.Core.Application.Interfaces;

namespace Taska.Core.Application.Features.Boards.Queries;

public class GetBoardsByProjectQueryHandler(IBoardRepository repository) : IRequestHandler<GetBoardsByProjectQuery, List<BoardResult>>
{
    public async ValueTask<List<BoardResult>> Handle(GetBoardsByProjectQuery request, CancellationToken cancellationToken)
    {
        var result = await repository.GetByProjectIdAsync(request.ProjectId, cancellationToken);

        return result.Adapt<List<BoardResult>>();
    }
}
