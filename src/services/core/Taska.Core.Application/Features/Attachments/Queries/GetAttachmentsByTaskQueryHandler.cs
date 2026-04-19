using Mapster;
using Mediator;
using Taska.Core.Application.Features.Attachments.DTOs;
using Taska.Core.Application.Interfaces;

namespace Taska.Core.Application.Features.Attachments.Queries;

public class GetAttachmentsByTaskQueryHandler(IAttachmentRepository repository, IFileStorageService storageService) : IRequestHandler<GetAttachmentsByTaskQuery, List<AttachmentResult>>
{
    public async ValueTask<List<AttachmentResult>> Handle(GetAttachmentsByTaskQuery request, CancellationToken cancellationToken)
    {
        var attachments = await repository.GetByTaskIdAsync(request.TaskId, cancellationToken);
        var results = new List<AttachmentResult>();

        foreach (var attachment in attachments)
        {
            var result = attachment.Adapt<AttachmentResult>();
            result.FileUrl = await storageService.GetPresignedUrlAsync(attachment.FileUrl, cancellationToken);
            results.Add(result);
        }

        return results;
    }
}