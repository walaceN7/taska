using Mediator;
namespace Taska.Core.Application.Features.Assignees.Commands;

public record UnassignTaskCommand(Guid TaskId, Guid UserId) : IRequest<bool>;