using Mapster;
using Mediator;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Taska.Identity.Application.Features.Users.DTOs;
using Taska.Identity.Application.Interfaces;
using Taska.Identity.Domain.Entities;
using Taska.Identity.Domain.Exceptions;

namespace Taska.Identity.Application.Features.Users.Queries;

public class GetCompanyMembersQueryHandler(UserManager<User> userManager, ICurrentUser currentUser) : IRequestHandler<GetCompanyMembersQuery, IEnumerable<MemberDto>>
{
    public async ValueTask<IEnumerable<MemberDto>> Handle(GetCompanyMembersQuery request, CancellationToken cancellationToken)
    {
        if (!currentUser.CompanyId.HasValue)
            throw new ValidationException("Current user does not belong to any company.");

        var result = await userManager.Users
            .Where(u => u.CompanyId == currentUser.CompanyId && u.IsActive)
            .ProjectToType<MemberDto>()
            .ToListAsync(cancellationToken);

        return result.Adapt<IEnumerable<MemberDto>>();
    }
}
