using Mediator;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Taska.Identity.Application.Features.Users.DTOs;
using Taska.Identity.Application.Interfaces;
using Taska.Identity.Domain.Entities;
using Taska.Shared.Exceptions;
using Taska.Shared.Pagination;

namespace Taska.Identity.Application.Features.Users.Queries;

public class GetPagedCompanyMembersQueryHandler(UserManager<User> userManager, ICurrentUser currentUser) : IRequestHandler<GetPagedCompanyMembersQuery, PagedResult<MemberDto>>
{
    public async ValueTask<PagedResult<MemberDto>> Handle(GetPagedCompanyMembersQuery request, CancellationToken cancellationToken)
    {
        if (!currentUser.CompanyId.HasValue)
            throw new ValidationException("Current user does not belong to any company.");

        var result = await userManager.Users
            .Where(u => u.CompanyId == currentUser.CompanyId)
            .OrderBy(u => u.FirstName)
            .Skip((request.PaginationParams.PageNumber - 1) * request.PaginationParams.PageSize)
            .Take(request.PaginationParams.PageSize)
            .Select(u => new MemberDto(u.Id, $"{u.FirstName} {u.LastName}", u.Email, u.AvatarUrl, u.SystemRole.ToString()))
            .ToListAsync(cancellationToken);           

        var totalCount = await userManager.Users
            .Where(u => u.CompanyId == currentUser.CompanyId)
            .CountAsync(cancellationToken);

        return new PagedResult<MemberDto>(result, totalCount, request.PaginationParams.PageNumber, request.PaginationParams.PageSize);        
    }
}
