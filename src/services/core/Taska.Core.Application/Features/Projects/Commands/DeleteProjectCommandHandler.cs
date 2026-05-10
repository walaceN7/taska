using Mediator;
using Taska.Core.Application.Interfaces;

namespace Taska.Core.Application.Features.Projects.Commands;

public class DeleteProjectCommandHandler(IProjectRepository repository) : IRequestHandler<DeleteProjectCommand>
{
    public async ValueTask<Unit> Handle(DeleteProjectCommand request, CancellationToken cancellationToken)
    {
        await repository.DeleteAsync(request.Id, cancellationToken);

        return Unit.Value;
    }
}
