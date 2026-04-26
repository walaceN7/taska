using Mediator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Taska.Identity.Application.Features.Invitations.Commands;
using Taska.Identity.Application.Features.Invitations.Queries;
using Taska.Shared.Pagination;

namespace Taska.Identity.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class InvitationsController(IMediator mediator) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> CreateInvitation([FromBody] CreateInvitationCommand command)
    {
        var result = await mediator.Send(command);

        return CreatedAtAction(nameof(CreateInvitation), new { id = result.Id }, result);
    }

    [HttpGet("pending")]
    public async Task<IActionResult> GetPendingInvitations()
    {
        var result = await mediator.Send(new GetPendingInvitationsQuery());
        return Ok(result);
    }

    [HttpGet("pending/paged")]
    public async Task<IActionResult> GetPagedPendingInvitations([FromQuery] PaginationParams paginationParams)
    {
        var result = await mediator.Send(new GetPagedPendingInvitationsQuery(paginationParams));
        return Ok(result);
    }
}