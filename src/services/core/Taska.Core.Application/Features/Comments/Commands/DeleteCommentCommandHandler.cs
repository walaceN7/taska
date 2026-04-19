using Mediator;
using Taska.Core.Application.Interfaces;
using Taska.Shared.Enums;
using Taska.Shared.Exceptions;

namespace Taska.Core.Application.Features.Comments.Commands;

public class DeleteCommentCommandHandler(ICommentRepository repository, ICurrentUser currentUser) : IRequestHandler<DeleteCommentCommand>
{
    public async ValueTask<Unit> Handle(DeleteCommentCommand request, CancellationToken cancellationToken)
    {
        var comment = await repository.GetByIdAsync(request.Id, cancellationToken) ?? throw new NotFoundException("Comment not found.");

        if (comment.UserId != currentUser.UserId && currentUser.SystemRole != SystemRole.SaasAdmin.ToString())
        {
            throw new UnauthorizedException("You can only delete your own comments.");
        }

        var result = await repository.DeleteAsync(comment, cancellationToken);

        return Unit.Value;
    }
}
