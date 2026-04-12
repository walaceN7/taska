using Mediator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Taska.Core.Application.Commands;

namespace Taska.Core.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CompanyController(IMediator mediator) : ControllerBase
{
    private readonly IMediator _mediator = mediator;

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCompanyCommand command)
    {
        var result = await _mediator.Send(command);
        return CreatedAtAction(nameof(Create), result);
    }
}