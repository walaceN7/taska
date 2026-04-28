using Mapster;
using Mediator;
using Taska.Core.Application.Features.Boards.DTOs;
using Taska.Core.Application.Interfaces;
using Taska.Shared.Exceptions;

namespace Taska.Core.Application.Features.Boards.Queries;

public class GetBoardByIdQueryHandler(IBoardRepository repository) : IRequestHandler<GetBoardByIdQuery, BoardResult>
{
    public async ValueTask<BoardResult> Handle(GetBoardByIdQuery request, CancellationToken cancellationToken)
    {
        var board = await repository.GetByIdAsync(request.Id, cancellationToken) ?? throw new NotFoundException($"Board with id {request.Id} not found.");

        return board.Adapt<BoardResult>();
    }
}
