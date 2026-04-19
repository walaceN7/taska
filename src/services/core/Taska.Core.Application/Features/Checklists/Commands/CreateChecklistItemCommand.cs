using Mediator;
using Taska.Core.Application.Features.Checklists.DTOs;

namespace Taska.Core.Application.Features.Checklists.Commands;

public record CreateChecklistItemCommand(string Title, Guid TaskId) : IRequest<ChecklistItemResult>;