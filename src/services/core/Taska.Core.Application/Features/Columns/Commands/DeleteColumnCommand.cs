using Mediator;

namespace Taska.Core.Application.Features.Columns.Commands;

public record DeleteColumnCommand(Guid Id) : IRequest<bool>;
