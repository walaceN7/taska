using Mediator;
using Taska.Core.Application.Features.Comments.DTOs;

namespace Taska.Core.Application.Features.Comments.Commands;

public record CreateCommentCommand(string Content, Guid TaskId) : IRequest<CommentResult>;
