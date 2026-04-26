using Mediator;
using Taska.Core.Application.Features.Projects.DTOs;
using Taska.Shared.Pagination;

namespace Taska.Core.Application.Features.Projects.Queries;

public record GetPagedProjectsByCompanyQuery(PaginationParams PaginationParams) : IRequest<PagedResult<ProjectResult>>;

