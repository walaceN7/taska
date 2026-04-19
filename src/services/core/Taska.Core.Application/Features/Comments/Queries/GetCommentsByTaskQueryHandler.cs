using Mapster;
using Mediator;
using Taska.Core.Application.Features.Comments.DTOs;
using Taska.Core.Application.Interfaces;

namespace Taska.Core.Application.Features.Comments.Queries;

public class GetCommentsByTaskQueryHandler(ICommentRepository repository) : IRequestHandler<GetCommentsByTaskQuery, List<CommentResult>>
{
    public async ValueTask<List<CommentResult>> Handle(GetCommentsByTaskQuery request, CancellationToken cancellationToken)
    {
        var comments = await repository.GetByTaskIdAsync(request.TaskId, cancellationToken);
        
        return comments.Adapt<List<CommentResult>>();
    }
}
