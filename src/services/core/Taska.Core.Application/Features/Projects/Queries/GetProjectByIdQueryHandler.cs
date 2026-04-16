using Mapster;
using Mediator;
using Taska.Core.Application.Features.Projects.DTOs;
using Taska.Core.Application.Interfaces;
using Taska.Shared.Exceptions;

namespace Taska.Core.Application.Features.Projects.Queries;

public class GetProjectByIdQueryHandler(IProjectRepository projectRepository) : IRequestHandler<GetProjectByIdQuery, ProjectResult>
{
    public async ValueTask<ProjectResult> Handle(GetProjectByIdQuery request, CancellationToken cancellationToken)
    {
        var result = await projectRepository.GetByIdAsync(request.Id, cancellationToken);

        return result is null ? throw new NotFoundException($"Project with id {request.Id} not found.") : result.Adapt<ProjectResult>();
    }
}
