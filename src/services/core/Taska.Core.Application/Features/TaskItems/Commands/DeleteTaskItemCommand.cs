using Mediator;

namespace Taska.Core.Application.Features.TaskItems.Commands;

public record DeleteTaskItemCommand(Guid Id) : IRequest<bool>;
