using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using Taska.Identity.Application.Interfaces;
using Taska.Identity.Domain.Enums;

namespace Taska.Identity.Infrastructure.Services;

public class CurrentUser(IHttpContextAccessor httpContextAccessor) : ICurrentUser
{
    private ClaimsPrincipal User => httpContextAccessor.HttpContext!.User;
    public Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    public Guid? CompanyId => Guid.TryParse(User.FindFirstValue("companyId"), out var id) ? id : null;
    public string Email => User.FindFirstValue(ClaimTypes.Email)!;
    public SystemRole SystemRole => Enum.Parse<SystemRole>(User.FindFirstValue("systemRole")!);
}