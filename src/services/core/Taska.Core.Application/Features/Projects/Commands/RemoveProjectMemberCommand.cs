using Mediator;

namespace Taska.Core.Application.Features.Projects.Commands;

public record RemoveProjectMemberCommand(Guid ProjectId, Guid UserId) : IRequest<bool>;
