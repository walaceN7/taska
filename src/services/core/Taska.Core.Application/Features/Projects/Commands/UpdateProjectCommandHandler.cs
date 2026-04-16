using Mapster;
using Mediator;
using Taska.Core.Application.Features.Projects.DTOs;
using Taska.Core.Application.Interfaces;
using Taska.Core.Domain.Exceptions;

namespace Taska.Core.Application.Features.Projects.Commands;

public class UpdateProjectCommandHandler(IProjectRepository projectRepository) : IRequestHandler<UpdateProjectCommand, ProjectResult>
{
    public async ValueTask<ProjectResult> Handle(UpdateProjectCommand request, CancellationToken cancellationToken)
    {
        var result = await projectRepository.GetByIdAsync(request.Id, cancellationToken) ?? throw new NotFoundException($"Project {request.Id} not found");

        if (request.Name is not null)
            result.Name = request.Name;

        if (request.Description is not null) 
            result.Description = request.Description;

        if (request.StartDate is not null) 
            result.StartDate = request.StartDate;

        if (request.EndDate is not null) 
            result.EndDate = request.EndDate;

        if (request.Status is not null) 
            result.Status = request.Status.Value;

        await projectRepository.UpdateAsync(result, cancellationToken);

        return result.Adapt<ProjectResult>();

    }
}
