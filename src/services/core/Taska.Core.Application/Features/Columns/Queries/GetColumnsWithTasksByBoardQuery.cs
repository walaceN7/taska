using Mediator;
using Taska.Core.Application.Features.Columns.DTOs;

namespace Taska.Core.Application.Features.Columns.Queries;

public record GetColumnsWithTasksByBoardQuery(Guid BoardId) : IRequest<IEnumerable<ColumnWithTasksResult>>;
