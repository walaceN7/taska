using Mediator;
using Taska.Core.Application.Features.Boards.DTOs;
using Taska.Shared.Pagination;

namespace Taska.Core.Application.Features.Boards.Queries;

public record GetPagedBoardByProjectQuery(Guid ProjectId, PaginationParams PaginationParams) : IRequest<PagedResult<BoardResult>>;
