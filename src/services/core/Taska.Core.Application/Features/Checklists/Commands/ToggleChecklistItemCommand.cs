using Mediator;

namespace Taska.Core.Application.Features.Checklists.Commands;

public record ToggleChecklistItemCommand(Guid Id) : IRequest<bool>;
