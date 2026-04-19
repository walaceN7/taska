using Mediator;
using Taska.Core.Application.Features.Comments.DTOs;

namespace Taska.Core.Application.Features.Comments.Commands;

public record UpdateCommentCommand(Guid Id, string Content) : IRequest<CommentResult>;

