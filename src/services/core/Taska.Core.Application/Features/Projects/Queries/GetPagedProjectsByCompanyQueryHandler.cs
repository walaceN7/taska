using Mediator;
using Taska.Core.Application.Features.Projects.DTOs;
using Taska.Core.Application.Interfaces;
using Taska.Shared.Exceptions;
using Taska.Shared.Pagination;

namespace Taska.Core.Application.Features.Projects.Queries;

public class GetPagedProjectsByCompanyQueryHandler(IProjectRepository repository, ICurrentUser currentUser) : IRequestHandler<GetPagedProjectsByCompanyQuery, PagedResult<ProjectResult>>
{
    public async ValueTask<PagedResult<ProjectResult>> Handle(GetPagedProjectsByCompanyQuery request, CancellationToken cancellationToken)
    {
        if (currentUser.CompanyId == null)
            throw new UnauthorizedException("Current user does not belong to a company.");

        var pagedProjects = await repository.GetByCompanyAsync(currentUser.CompanyId.Value, request.PaginationParams, cancellationToken);

        var projectResults = pagedProjects.Items.Select(p => new ProjectResult(p.Id, p.Name, p.StartDate, p.EndDate, p.Status, p.CompanyId, p.Company.Name)).ToList();

        return new PagedResult<ProjectResult>(
            projectResults,
            pagedProjects.TotalCount,
            pagedProjects.PageNumber,
            pagedProjects.PageSize);
    }
}
