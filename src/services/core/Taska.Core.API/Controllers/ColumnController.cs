using Mediator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Taska.Core.Application.Features.Columns.Commands;
using Taska.Core.Application.Features.TaskItems.Commands;
using Taska.Core.Application.Features.TaskItems.Queries;

namespace Taska.Core.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class ColumnController(IMediator mediator) : ControllerBase
{
    [HttpPost("{columnId}/tasks")]
    public async Task<IActionResult> CreateTask(Guid columnId, [FromBody] CreateTaskItemCommand command)
    {
        var result = await mediator.Send(command with { ColumnId = columnId });
        return CreatedAtAction(nameof(CreateTask), result);
    }

    [HttpGet("{columnId}/tasks")]
    public async Task<IActionResult> GetTasks(Guid columnId)
    {
        var result = await mediator.Send(new GetTasksByColumnQuery(columnId));
        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateColumn(Guid id, [FromBody] UpdateColumnCommand command)
    {
        var result = await mediator.Send(command with { Id = id });
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteColumn(Guid id)
    {
        await mediator.Send(new DeleteColumnCommand(id));
        return NoContent();
    }
}
