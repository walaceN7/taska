using Mediator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
}