using Mediator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Taska.Core.Application.Features.Assignees.Commands;
using Taska.Core.Application.Features.Assignees.Queries;
using Taska.Core.Application.Features.Attachments.Commands;
using Taska.Core.Application.Features.Attachments.Queries;
using Taska.Core.Application.Features.Checklists.Commands;
using Taska.Core.Application.Features.Checklists.Queries;
using Taska.Core.Application.Features.Comments.Commands;
using Taska.Core.Application.Features.Comments.Queries;
using Taska.Core.Application.Features.TaskItems.Commands;
using Taska.Core.Application.Features.TaskItems.Queries;

namespace Taska.Core.API.Controllers;

[Route("api/tasks")]
[ApiController]
[Authorize]
public class TaskItemController(IMediator mediator) : ControllerBase
{
    // ==========================================
    // CORE TASK ACTIONS
    // ==========================================

    [HttpPost("{taskId}/move")]
    public async Task<IActionResult> MoveTask(Guid taskId, [FromBody] MoveTaskItemCommand command)
    {
        var result = await mediator.Send(command with { TaskId = taskId });
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetTaskById(Guid id)
    {
        var result = await mediator.Send(new GetTaskItemByIdQuery(id));
        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTask(Guid id, [FromBody] UpdateTaskItemCommand command)
    {
        var result = await mediator.Send(command with { Id = id });
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(Guid id)
    {
        await mediator.Send(new DeleteTaskItemCommand(id));
        return NoContent();
    }

    // ==========================================
    // CHECKLISTS
    // ==========================================

    [HttpPost("{taskId}/checklists")]
    public async Task<IActionResult> CreateChecklistItem(Guid taskId, [FromBody] CreateChecklistItemCommand command)
    {
        var result = await mediator.Send(command with { TaskId = taskId });
        return CreatedAtAction(nameof(CreateChecklistItem), result);
    }

    [HttpGet("{taskId}/checklists")]
    public async Task<IActionResult> GetChecklistItems(Guid taskId)
    {
        var result = await mediator.Send(new GetChecklistsByTaskQuery(taskId));
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

    // ==========================================
    // COMMENTS
    // ==========================================

    [HttpPost("{taskId}/comments")]
    public async Task<IActionResult> CreateComment(Guid taskId, [FromBody] CreateCommentCommand command)
    {
        var result = await mediator.Send(command with { TaskId = taskId });
        return CreatedAtAction(nameof(CreateComment), result);
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

    [HttpDelete("comments/{id}")]
    public async Task<IActionResult> DeleteComment(Guid id)
    {
        await mediator.Send(new DeleteCommentCommand(id));
        return NoContent();
    }

    // ==========================================
    // ATTACHMENTS (FILES)
    // ==========================================

    [HttpPost("{taskId}/attachments")]
    public async Task<IActionResult> CreateAttachment(Guid taskId, [FromForm] IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("File is empty.");

        var command = new CreateAttachmentCommand(taskId, file);
        var result = await mediator.Send(command);

        return CreatedAtAction(nameof(CreateAttachment), result);
    }

    [HttpGet("{taskId}/attachments")]
    public async Task<IActionResult> GetAttachments(Guid taskId)
    {
        var result = await mediator.Send(new GetAttachmentsByTaskQuery(taskId));
        return Ok(result);
    }

    [HttpDelete("attachments/{id}")]
    public async Task<IActionResult> DeleteAttachment(Guid id)
    {
        await mediator.Send(new DeleteAttachmentCommand(id));
        return NoContent();
    }

    // ==========================================
    // ASSIGNEES
    // ==========================================

    [HttpPost("{taskId}/assignees")]
    public async Task<IActionResult> AssignTask(Guid taskId, [FromBody] AssignTaskCommand command)
    {
        var result = await mediator.Send(command with { TaskId = taskId });
        return Ok(result);
    }

    [HttpGet("{taskId}/assignees")]
    public async Task<IActionResult> GetAssignees(Guid taskId)
    {
        var result = await mediator.Send(new GetAssigneesByTaskQuery(taskId));
        return Ok(result);
    }

    [HttpDelete("{taskId}/assignees/{userId}")]
    public async Task<IActionResult> UnassignTask(Guid taskId, Guid userId)
    {
        await mediator.Send(new UnassignTaskCommand(taskId, userId));
        return NoContent();
    }
}