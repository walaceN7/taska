using Mediator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Taska.Identity.Application.Features.Users.Queries;
using Taska.Shared.Pagination;

namespace Taska.Identity.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class UserController(IMediator mediator) : ControllerBase
{
    [HttpGet("company/members")]
    public async Task<IActionResult> GetCompanyMembers()
    {
        var result = await mediator.Send(new GetCompanyMembersQuery());
        return Ok(result);
    }

    [HttpGet("company/members/paged")]
    public async Task<IActionResult> GetPagedCompanyMembers([FromQuery] PaginationParams paginationParams)
    {
        var result = await mediator.Send(new GetPagedCompanyMembersQuery(paginationParams));
        return Ok(result);
    }
}
