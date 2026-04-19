using Mediator;
using Taska.Core.Application.Features.Checklists.DTOs;

namespace Taska.Core.Application.Features.Checklists.Queries;

public record GetChecklistsByTaskQuery(Guid TaskId) : IRequest<List<ChecklistItemResult>>;
