using Mapster;
using Mediator;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Taska.Identity.Application.Features.Users.DTOs;
using Taska.Identity.Application.Interfaces;
using Taska.Identity.Domain.Entities;
using Taska.Shared.Pagination;

namespace Taska.Identity.Application.Features.Users.Queries;

public class SearchCompanyMembersQueryHandler(UserManager<User> userManager, ICurrentUser currentUser) : IRequestHandler<SearchCompanyMembersQuery, PagedResult<MemberDto>>
{
    public async ValueTask<PagedResult<MemberDto>> Handle(SearchCompanyMembersQuery request, CancellationToken cancellationToken)
    {
        var query = userManager.Users
            .Where(u => u.CompanyId == currentUser.CompanyId)
            .AsNoTracking();

        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            var searchTerm = request.SearchTerm.ToLower();
            query = query.Where(u =>
                (u.FirstName + " " + u.LastName).ToLower().Contains(searchTerm) ||
                u.Email.ToLower().Contains(searchTerm));
        }

        query = query.OrderBy(u => u.FirstName).ThenBy(u => u.LastName);

        return await query
            .ProjectToType<MemberDto>()
            .ToPagedResultAsync(request.PaginationParams.PageNumber, request.PaginationParams.PageSize, cancellationToken);
    }
}