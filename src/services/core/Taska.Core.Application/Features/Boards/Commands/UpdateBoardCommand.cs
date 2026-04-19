using Mediator;
using Taska.Core.Application.Features.Boards.DTOs;

namespace Taska.Core.Application.Features.Boards.Commands;

public record UpdateBoardCommand(Guid Id, string Name) : IRequest<BoardResult>;
