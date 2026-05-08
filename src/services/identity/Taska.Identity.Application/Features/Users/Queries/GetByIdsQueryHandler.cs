using Mapster;
using Mediator;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Taska.Identity.Application.Features.Users.DTOs;
using Taska.Identity.Domain.Entities;

namespace Taska.Identity.Application.Features.Users.Queries;

public class GetByIdsQueryHandler(UserManager<User> userManager) : IRequestHandler<GetByIdsQuery, IEnumerable<MemberDto>>
{
    public async ValueTask<IEnumerable<MemberDto>> Handle(GetByIdsQuery request, CancellationToken cancellationToken)
    {
        return await userManager.Users
            .Where(u => request.Ids.Contains(u.Id))
            .AsNoTracking()
            .ProjectToType<MemberDto>()
            .ToListAsync(cancellationToken);
    }
}
