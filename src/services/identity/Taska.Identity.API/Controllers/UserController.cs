using Mediator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Taska.Identity.Application.Features.Users.Queries;

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
}
