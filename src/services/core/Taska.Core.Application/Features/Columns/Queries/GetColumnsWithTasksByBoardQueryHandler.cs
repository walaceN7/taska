using Mapster;
using Mediator;
using Taska.Core.Application.Features.Columns.DTOs;
using Taska.Core.Application.Features.TaskItems.DTOs;
using Taska.Core.Application.Interfaces;
using Taska.Core.Domain.Entities;

namespace Taska.Core.Application.Features.Columns.Queries;

public class GetColumnsWithTasksByBoardQueryHandler(IColumnRepository repository) : IRequestHandler<GetColumnsWithTasksByBoardQuery, IEnumerable<ColumnWithTasksResult>>
{
    public async ValueTask<IEnumerable<ColumnWithTasksResult>> Handle(GetColumnsWithTasksByBoardQuery request, CancellationToken cancellationToken)
    {
        var columns = await repository.GetColumnsWithTasksByBoardIdAsync(request.BoardId, cancellationToken);

        return columns.Adapt<IEnumerable<ColumnWithTasksResult>>();
    }
}   
          
