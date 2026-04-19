using Mediator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Taska.Core.Application.Features.Checklists.Commands;
using Taska.Core.Application.Features.Checklists.Queries;
using Taska.Core.Application.Features.Comments.Commands;
using Taska.Core.Application.Features.Comments.Queries;
using Taska.Core.Application.Features.TaskItems.Commands;

namespace Taska.Core.API.Controllers;

[Route("api/tasks")]
[ApiController]
[Authorize]
public class TaskItemController(IMediator mediator) : ControllerBase
{    
    [HttpPost("{taskId}/move")]
    public async Task<IActionResult> MoveTask(Guid taskId, [FromBody] MoveTaskItemCommand command)
    {
        var result = await mediator.Send(command with { TaskId = taskId });
        return Ok(result);
    }

    [HttpPost("{taskId}/checklists")]
    public async Task<IActionResult> CreateChecklistItem(Guid taskId, [FromBody] CreateChecklistItemCommand command)
    {
        var result = await mediator.Send(command with { TaskId = taskId });
        return Ok(result);
    }

    [HttpPost("{taskId}/comments")]
    public async Task<IActionResult> CreateComment(Guid taskId, [FromBody] CreateCommentCommand command)
    {
        var result = await mediator.Send(command with { TaskId = taskId });
        return Ok(result);
    }

    [HttpGet("{taskId}/checklists")]
    public async Task<IActionResult> GetChecklistItems(Guid taskId)
    {
        var result = await mediator.Send(new GetChecklistsByTaskQuery(taskId));
        return Ok(result);
    }

    [HttpGet("{taskId}/comments")]
    public async Task<IActionResult> GetComments(Guid taskId)
    {
        var result = await mediator.Send(new GetCommentsByTaskQuery(taskId));
        return Ok(result);
    }

    [HttpPut("comments/{id}")]
    public async Task<IActionResult> UpdateComment(Guid id, [FromBody] UpdateCommentCommand command)
    {
        var result = await mediator.Send(command with { Id = id });
        return Ok(result);
    }

    [HttpPatch("checklists/{id}/toggle")]
    public async Task<IActionResult> ToggleChecklistItem(Guid id)
    {
        var result = await mediator.Send(new ToggleChecklistItemCommand(id));
        return Ok(result);
    }

    [HttpDelete("checklists/{id}")]
    public async Task<IActionResult> DeleteChecklistItem(Guid id)
    {
        await mediator.Send(new DeleteChecklistItemCommand(id));
        return NoContent();
    }

    [HttpDelete("comments/{id}")]
    public async Task<IActionResult> DeleteComment(Guid id)
    {
        await mediator.Send(new DeleteCommentCommand(id));
        return NoContent();
    }
}