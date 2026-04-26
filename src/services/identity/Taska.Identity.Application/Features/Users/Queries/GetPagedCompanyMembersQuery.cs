using Mediator;
using Taska.Identity.Application.Features.Users.DTOs;
using Taska.Shared.Pagination;

namespace Taska.Identity.Application.Features.Users.Queries
{
    public record GetPagedCompanyMembersQuery(PaginationParams PaginationParams) : IRequest<PagedResult<MemberDto>>;
}
