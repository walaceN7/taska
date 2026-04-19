using Mediator;
using Taska.Core.Application.Interfaces;
using Taska.Shared.Exceptions;

namespace Taska.Core.Application.Features.Attachments.Commands;

public class DeleteAttachmentCommandHandler(IAttachmentRepository repository, IFileStorageService storageService) : IRequestHandler<DeleteAttachmentCommand, bool>
{
    public async ValueTask<bool> Handle(DeleteAttachmentCommand request, CancellationToken cancellationToken)
    {
        var attachment = await repository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new NotFoundException("Attachment not found.");
                
        await storageService.DeleteAsync(attachment.FileUrl, cancellationToken);
                
        await repository.DeleteAsync(attachment, cancellationToken);

        return true;
    }
}