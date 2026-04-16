using Mediator;
using Taska.Core.Application.Features.Boards.DTOs;
using Taska.Core.Domain.Enums;

namespace Taska.Core.Application.Features.Boards.Commands;

public record CreateBoardCommand(Guid ProjectId, string Name, BoardType Type) : IRequest<BoardResult>;
