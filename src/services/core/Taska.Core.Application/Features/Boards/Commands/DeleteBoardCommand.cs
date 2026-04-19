using Mediator;

namespace Taska.Core.Application.Features.Boards.Commands;

public record DeleteBoardCommand(Guid Id) : IRequest<bool>;
