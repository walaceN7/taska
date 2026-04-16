using Mapster;
using Mediator;
using Taska.Core.Application.Features.Boards.DTOs;
using Taska.Core.Application.Interfaces;
using Taska.Core.Domain.Entities;

namespace Taska.Core.Application.Features.Boards.Commands;

public class CreateBoardCommandHandler(IBoardRepository repository) : IRequestHandler<CreateBoardCommand, BoardResult>
{
    public async ValueTask<BoardResult> Handle(CreateBoardCommand request, CancellationToken cancellationToken)
    {
        var board = request.Adapt<Board>();

        var created = await repository.AddAsync(board, cancellationToken);

        return created.Adapt<BoardResult>();

    }
}
