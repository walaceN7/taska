using Mapster;
using Mediator;
using Taska.Core.Application.Features.Boards.DTOs;
using Taska.Core.Application.Interfaces;
using Taska.Shared.Exceptions;

namespace Taska.Core.Application.Features.Boards.Commands;

public class UpdateBoardCommandHandler(IBoardRepository repository) : IRequestHandler<UpdateBoardCommand, BoardResult>
{
    public async ValueTask<BoardResult> Handle(UpdateBoardCommand request, CancellationToken cancellationToken)
    {
        var board = await repository.GetByIdAsync(request.Id, cancellationToken) ?? throw new NotFoundException("Board not found.");

        board.Name = request.Name;

        await repository.UpdateAsync(board, cancellationToken);
        return board.Adapt<BoardResult>();
    }
}
