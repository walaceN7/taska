using Mapster;
using Mediator;
using Taska.Core.Application.Features.Comments.DTOs;
using Taska.Core.Application.Interfaces;
using Taska.Shared.Enums;
using Taska.Shared.Exceptions;

namespace Taska.Core.Application.Features.Comments.Commands;

public class UpdateCommentCommandHandler(ICommentRepository repository, ICurrentUser currentUser) : IRequestHandler<UpdateCommentCommand, CommentResult>
{
    public async ValueTask<CommentResult> Handle(UpdateCommentCommand request, CancellationToken cancellationToken)
    {
        var comment = await repository.GetByIdAsync(request.Id, cancellationToken) ?? throw new NotFoundException("Comment not found.");

        if (comment.UserId != currentUser.UserId && currentUser.SystemRole != SystemRole.SaasAdmin.ToString())
        {
            throw new UnauthorizedException("You can only edit your own comments.");
        }

        comment.Content = request.Content;

        var result = await repository.UpdateAsync(comment, cancellationToken);
        return result.Adapt<CommentResult>();
    }
}
