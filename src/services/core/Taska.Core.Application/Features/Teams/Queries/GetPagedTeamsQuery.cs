using Mediator;
using Taska.Core.Application.Features.Teams.DTOs;
using Taska.Shared.Pagination;

namespace Taska.Core.Application.Features.Teams.Queries;

public record GetPagedTeamsQuery(PaginationParams PaginationParams) : IRequest<PagedResult<TeamResult>>;
