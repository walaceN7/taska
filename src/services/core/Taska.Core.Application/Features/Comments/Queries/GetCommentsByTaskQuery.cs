using Mediator;
using Taska.Core.Application.Features.Comments.DTOs;

namespace Taska.Core.Application.Features.Comments.Queries;

public record GetCommentsByTaskQuery(Guid TaskId) : IRequest<List<CommentResult>>;
