using Mediator;
using Taska.Core.Application.Features.Columns.DTOs;

namespace Taska.Core.Application.Features.Columns.Commands;

public record CreateColumnCommand(Guid BoardId, string Name) : IRequest<ColumnResult>;