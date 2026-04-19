using Mediator;
using Taska.Core.Application.Features.Columns.DTOs;

namespace Taska.Core.Application.Features.Columns.Commands;

public record UpdateColumnCommand(Guid Id, string Name) : IRequest<ColumnResult>;
