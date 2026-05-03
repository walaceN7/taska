using Mediator;
using Taska.Core.Application.Features.Columns.DTOs;

namespace Taska.Core.Application.Features.Columns.Commands;

public record MoveColumnCommand(Guid ColumnId, int NewOrder) : IRequest<ColumnResult>;
