using Mediator;
using Taska.Core.Application.Features.Assignees.DTOs;

namespace Taska.Core.Application.Features.Assignees.Queries
{
    public record GetAssigneesByTaskQuery(Guid TaskId) : IRequest<List<TaskAssigneeResult>>;
    
}
