using Mediator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Taska.Core.Application.Features.Boards.Commands;
using Taska.Core.Application.Features.Boards.Queries;
using Taska.Core.Application.Features.Columns.Commands;
using Taska.Core.Application.Features.Columns.Queries;

namespace Taska.Core.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class BoardController(IMediator mediator) : ControllerBase
{
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await mediator.Send(new GetBoardByIdQuery(id));
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBoardCommand command)
    {
        var result = await mediator.Send(command);
        return CreatedAtAction(nameof(Create), result);
    }

    [HttpPost("{boardId}/columns")]
    public async Task<IActionResult> CreateColumn(Guid boardId, [FromBody] CreateColumnCommand command)
    {
        var result = await mediator.Send(command with { BoardId = boardId });
        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBoard(Guid id, [FromBody] UpdateBoardCommand command)
    {
        var result = await mediator.Send(command with { Id = id });
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBoard(Guid id)
    {
        await mediator.Send(new DeleteBoardCommand(id));
        return NoContent();
    }

    [HttpGet("{boardId}/columns")]
    public async Task<IActionResult> GetColumns(Guid boardId)
    {
        var result = await mediator.Send(new GetColumnsWithTasksByBoardQuery(boardId));
        return Ok(result);
    }
}
