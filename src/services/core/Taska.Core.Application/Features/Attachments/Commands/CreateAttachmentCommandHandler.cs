using Mapster;
using Mediator;
using Taska.Core.Application.Features.Attachments.DTOs;
using Taska.Core.Application.Interfaces;
using Taska.Core.Domain.Entities;

namespace Taska.Core.Application.Features.Attachments.Commands;

public class CreateAttachmentCommandHandler(IAttachmentRepository repository, IFileStorageService storageService, ICurrentUser currentUser) : IRequestHandler<CreateAttachmentCommand, AttachmentResult>
{
    public async ValueTask<AttachmentResult> Handle(CreateAttachmentCommand request, CancellationToken cancellationToken)
    {
        var fileExtension = Path.GetExtension(request.File.FileName);
        var uniqueFileName = $"{Guid.NewGuid()}{fileExtension}";

        using var stream = request.File.OpenReadStream();
        var fileUrl = await storageService.UploadAsync(stream, uniqueFileName, request.File.ContentType, cancellationToken);

        var attachment = new Attachment
        {
            TaskId = request.TaskId,
            UserId = currentUser.UserId,
            FileName = request.File.FileName,
            FileUrl = fileUrl,
            ContentType = request.File.ContentType,
            FileSize = request.File.Length
        };

        var created = await repository.AddAsync(attachment, cancellationToken);
        return created.Adapt<AttachmentResult>();
    }
}