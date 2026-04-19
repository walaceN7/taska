using Mediator;
namespace Taska.Core.Application.Features.Attachments.Commands;

public record DeleteAttachmentCommand(Guid Id) : IRequest<bool>;