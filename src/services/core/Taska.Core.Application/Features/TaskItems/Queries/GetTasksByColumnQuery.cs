using Mediator;
using Taska.Core.Application.Features.TaskItems.DTOs;

namespace Taska.Core.Application.Features.TaskItems.Queries;

public record GetTasksByColumnQuery(Guid ColumnId) : IRequest<IEnumerable<TaskItemResult>>;

