using Mapster;
using Mediator;
using Taska.Core.Application.Features.Comments.DTOs;
using Taska.Core.Application.Interfaces;
using Taska.Core.Domain.Entities;

namespace Taska.Core.Application.Features.Comments.Commands;

public class CreateCommentCommandHandler(ICommentRepository repository, ICurrentUser currentUser) : IRequestHandler<CreateCommentCommand, CommentResult>
{
    public async ValueTask<CommentResult> Handle(CreateCommentCommand request, CancellationToken cancellationToken)
    {
        var comment = request.Adapt<Comment>();
        comment.UserId = currentUser.UserId;

        var created = await repository.AddAsync(comment, cancellationToken);
        return created.Adapt<CommentResult>();
    }
}
