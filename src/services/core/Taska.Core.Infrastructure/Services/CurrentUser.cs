using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Taska.Core.Application.Interfaces;

namespace Taska.Core.Infrastructure.Services;

public class CurrentUser(IHttpContextAccessor httpContextAccessor) : ICurrentUser
{
    private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;

    private ClaimsPrincipal User => _httpContextAccessor.HttpContext!.User;

    public Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    public Guid? CompanyId => Guid.TryParse(User.FindFirstValue("companyId"), out var id) ? id : null;
    public string Email => User.FindFirstValue(ClaimTypes.Email)!;
    public string SystemRole => User.FindFirstValue("systemRole")!;
}