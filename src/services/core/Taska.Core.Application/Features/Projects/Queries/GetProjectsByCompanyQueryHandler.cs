using Mapster;
using Mediator;
using Taska.Core.Application.Features.Projects.DTOs;
using Taska.Core.Application.Interfaces;
using Taska.Shared.Exceptions;

namespace Taska.Core.Application.Features.Projects.Queries;

public class GetProjectsByCompanyQueryHandler(IProjectRepository projectRepository, ICurrentUser currentUser) : IRequestHandler<GetProjectsByCompanyQuery, IEnumerable<ProjectResult>>
{
    public async ValueTask<IEnumerable<ProjectResult>> Handle(GetProjectsByCompanyQuery request, CancellationToken cancellationToken)
    {
        if (currentUser.CompanyId == null)
            throw new UnauthorizedException("Current user does not belong to a company.");        

        var result = await projectRepository.GetByCompanyAsync(currentUser.CompanyId.Value, cancellationToken);

        return result.Adapt<IEnumerable<ProjectResult>>();
    }
}
