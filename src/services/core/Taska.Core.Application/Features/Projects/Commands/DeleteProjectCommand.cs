using Mediator;

namespace Taska.Core.Application.Features.Projects.Commands;

public record DeleteProjectCommand(Guid Id) : IRequest<Unit>;
