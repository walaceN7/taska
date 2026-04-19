using Mediator;

namespace Taska.Core.Application.Features.Checklists.Commands;

public record DeleteChecklistItemCommand(Guid Id) : IRequest<bool>;
