using Mediator;
using Taska.Core.Application.Features.Boards.DTOs;
using Taska.Core.Application.Interfaces;
using Taska.Shared.Pagination;

namespace Taska.Core.Application.Features.Boards.Queries;

public class GetPagedBoardByProjectQueryHandler(IBoardRepository repositoy) : IRequestHandler<GetPagedBoardByProjectQuery, PagedResult<BoardResult>>
{
    public async ValueTask<PagedResult<BoardResult>> Handle(GetPagedBoardByProjectQuery request, CancellationToken cancellationToken)
    {
        var pagedBoards = await repositoy.GetByProjectIdAsync(request.ProjectId, request.PaginationParams, cancellationToken);

        var boardResults = pagedBoards.Items.Select(board => new BoardResult
        {
            Id = board.Id,
            ProjectId = board.ProjectId,
            Name = board.Name,
            Type = board.Type
        }).ToList();

        return new PagedResult<BoardResult>(
            boardResults,
            pagedBoards.TotalCount,
            pagedBoards.PageNumber,
            pagedBoards.PageSize
        );
    }
}
