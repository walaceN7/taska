using Mapster;
using Taska.Core.Application.Features.Attachments.DTOs;
using Taska.Core.Domain.Entities;

namespace Taska.Core.Application.Features.Attachments.Mapping;

public class AttachmentMapping : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<Attachment, AttachmentResult>();
    }
}
