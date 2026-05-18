using Mediator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Taska.Identity.Application.Features.Users.Commands;
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

    [HttpPost("by/ids")]
    public async Task<IActionResult> GetUsersByIds([FromBody] IEnumerable<Guid> userIds)
    {
        var result = await mediator.Send(new GetByIdsQuery(userIds));
        return Ok(result);
    }

    [HttpGet("company/members/search")]
    public async Task<IActionResult> SearchCompanyMembers([FromQuery] string? searchTerm, [FromQuery] PaginationParams paginationParams)
    {
        var result = await mediator.Send(new SearchCompanyMembersQuery(searchTerm, paginationParams));
        return Ok(result);
    }

    [HttpPut("members/{userId}/role")]
    public async Task<IActionResult> UpdateMemberRole(Guid userId, [FromBody] UpdateMemberRoleCommand command)
    {        
        if (userId != command.UserId) return BadRequest();

        await mediator.Send(command);
        return NoContent();
    }

    [HttpDelete("members/{userId}")]
    public async Task<IActionResult> RemoveMember(Guid userId)
    {
        await mediator.Send(new RemoveCompanyMemberCommand(userId));
        return NoContent();
    }
}
