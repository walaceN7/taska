using Taska.Core.Domain.Entities;

namespace Taska.Core.Application.Interfaces;

public interface IAttachmentRepository
{
    Task<Attachment> AddAsync(Attachment attachment, CancellationToken cancellationToken = default);
    Task<Attachment?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<Attachment>> GetByTaskIdAsync(Guid taskId, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Attachment attachment, CancellationToken cancellationToken = default);
}
