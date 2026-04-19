using Mediator;

namespace Taska.Core.Application.Features.Comments.Commands;

public record DeleteCommentCommand(Guid Id) : IRequest;
