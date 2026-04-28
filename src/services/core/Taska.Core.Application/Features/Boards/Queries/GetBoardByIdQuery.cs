using Mediator;
using Taska.Core.Application.Features.Boards.DTOs;

namespace Taska.Core.Application.Features.Boards.Queries;

public record GetBoardByIdQuery(Guid Id) : IRequest<BoardResult>;
