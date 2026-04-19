using Mediator;
using Taska.Core.Application.Features.Attachments.DTOs;

namespace Taska.Core.Application.Features.Attachments.Queries;

public record GetAttachmentsByTaskQuery(Guid TaskId) : IRequest<List<AttachmentResult>>;