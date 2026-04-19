using Mediator;
using Microsoft.AspNetCore.Http;
using Taska.Core.Application.Features.Attachments.DTOs;

namespace Taska.Core.Application.Features.Attachments.Commands;

public record CreateAttachmentCommand(Guid TaskId, IFormFile File) : IRequest<AttachmentResult>;