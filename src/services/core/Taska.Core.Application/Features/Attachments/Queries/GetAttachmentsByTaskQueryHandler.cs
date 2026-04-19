using Mapster;
using Mediator;
using Taska.Core.Application.Features.Attachments.DTOs;
using Taska.Core.Application.Interfaces;

namespace Taska.Core.Application.Features.Attachments.Queries;

public class GetAttachmentsByTaskQueryHandler(IAttachmentRepository repository) : IRequestHandler<GetAttachmentsByTaskQuery, List<AttachmentResult>>
{
    public async ValueTask<List<AttachmentResult>> Handle(GetAttachmentsByTaskQuery request, CancellationToken cancellationToken)
    {
        var attachments = await repository.GetByTaskIdAsync(request.TaskId, cancellationToken);
        return attachments.Adapt<List<AttachmentResult>>();
    }
}