using Mediator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Taska.Core.Application.Features.Boards.Queries;
using Taska.Core.Application.Features.Projects.Commands;
using Taska.Core.Application.Features.Projects.Queries;

namespace Taska.Core.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProjectController(IMediator mediator) : ControllerBase
{
    private readonly IMediator _mediator = mediator;

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProjectCommand command)
    {
        var result = await _mediator.Send(command);
        return CreatedAtAction(nameof(Create), result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _mediator.Send(new GetProjectByIdQuery(id));
        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetByCompany()
    {
        var result = await _mediator.Send(new GetProjectsByCompanyQuery());
        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateProjectCommand command)
    {
        var result = await _mediator.Send(command with { Id = id });
        return Ok(result);
    }

    [HttpPost("{id}/members")]
    public async Task<IActionResult> AddMember(Guid id, [FromBody] AddProjectMemberCommand command)
    {
        var result = await _mediator.Send(command with { ProjectId = id });
        return Ok(result);
    }

    [HttpGet("{projectId}/boards")]
    public async Task<IActionResult> GetBoards(Guid projectId)
    {
        var result = await _mediator.Send(new GetBoardsByProjectQuery(projectId));
        return Ok(result);
    }

    [HttpDelete("{projectId}/members/{userId}")]
    public async Task<IActionResult> RemoveMember(Guid projectId, Guid userId)
    {
        await _mediator.Send(new RemoveProjectMemberCommand(projectId, userId));
        return NoContent();
    }
}
