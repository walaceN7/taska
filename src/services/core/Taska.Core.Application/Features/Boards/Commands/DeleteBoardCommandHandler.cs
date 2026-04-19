using Mediator;
using Taska.Core.Application.Interfaces;
using Taska.Shared.Exceptions;

namespace Taska.Core.Application.Features.Boards.Commands;

public class DeleteBoardCommandHandler(IBoardRepository repository) : IRequestHandler<DeleteBoardCommand, bool>
{
    public async ValueTask<bool> Handle(DeleteBoardCommand request, CancellationToken cancellationToken)
    {
        var board = await repository.GetByIdAsync(request.Id, cancellationToken) ?? throw new NotFoundException("Board not found.");
        return await repository.DeleteAsync(board, cancellationToken);
    }
}
