using Mediator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Taska.Core.Application.Features.Teams.Commands;
using Taska.Core.Application.Features.Teams.Queries;
using Taska.Shared.Pagination;

namespace Taska.Core.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TeamController(IMediator mediator) : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateTeamCommand command)
        {
            var result = await mediator.Send(command);
            return CreatedAtAction(nameof(Create), result);
        }

        [HttpGet("company")]
        public async Task<IActionResult> GetByCompany()
        {
            var result = await mediator.Send(new GetTeamsQuery());
            return Ok(result);
        }

        [HttpGet("company/paged")]
        public async Task<IActionResult> GetPagedByCompany([FromQuery] PaginationParams paginationParams)
        {
            var result = await mediator.Send(new GetPagedTeamsQuery(paginationParams));
            return Ok(result);
        }
    }
}
